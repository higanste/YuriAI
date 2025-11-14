// Background service worker for YuriAI extension

const OPENROUTER_API_KEY = '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';
const DEFAULT_MODEL = 'google/gemini-pro';

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle chat requests
  if (request.action === 'chat') {
    handleChat(request.messages, request.model)
      .then(response => {
        sendResponse({ success: true, response });
      })
      .catch(error => {
        console.error('Chat error in background:', error);
        sendResponse({ success: false, error: error.message || 'Unknown error' });
      });
    return true; // Keep channel open for async response
  }

  // Handle action execution
  if (request.action === 'executeAction') {
    const tabId = request.tabId || sender?.tab?.id;
    if (!tabId) {
      sendResponse({ success: false, error: 'No tab ID provided' });
      return false;
    }
    executeAction(request.actionType, request.params, tabId)
      .then(result => {
        sendResponse({ success: true, result });
      })
      .catch(error => {
        console.error('Action execution error:', error);
        sendResponse({ success: false, error: error.message || 'Unknown error' });
      });
    return true; // Keep channel open for async response
  }

  // Handle data extraction
  if (request.action === 'extractData') {
    const tabId = request.tabId || sender?.tab?.id;
    if (!tabId) {
      sendResponse({ success: false, error: 'No tab ID provided' });
      return false;
    }
    extractData(tabId, request.selector)
      .then(data => {
        sendResponse({ success: true, data });
      })
      .catch(error => {
        console.error('Data extraction error:', error);
        sendResponse({ success: false, error: error.message || 'Unknown error' });
      });
    return true; // Keep channel open for async response
  }

  // Return false if no handler matched
  return false;
});

async function handleChat(messages, model = DEFAULT_MODEL) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://yuriai.vercel.app',
        'X-Title': 'YuriAI - AI Agent Extension',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

async function executeAction(actionType, params, tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: performAction,
      args: [actionType, params],
    });

    return results[0]?.result;
  } catch (error) {
    console.error('Action execution error:', error);
    throw error;
  }
}

function performAction(actionType, params) {
  switch (actionType) {
    case 'click':
      const element = document.querySelector(params.selector);
      if (element) {
        element.click();
        return { success: true, message: `Clicked on ${params.selector}` };
      }
      return { success: false, message: `Element not found: ${params.selector}` };

    case 'type':
      const input = document.querySelector(params.selector);
      if (input) {
        input.value = params.text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return { success: true, message: `Typed into ${params.selector}` };
      }
      return { success: false, message: `Input not found: ${params.selector}` };

    case 'extract':
      const elements = Array.from(document.querySelectorAll(params.selector));
      const data = elements.map(el => el.textContent?.trim()).filter(Boolean);
      return { success: true, data };

    case 'navigate':
      window.location.href = params.url;
      return { success: true, message: `Navigating to ${params.url}` };

    default:
      return { success: false, message: `Unknown action: ${actionType}` };
  }
}

async function extractData(tabId, selector) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: (sel) => {
        const elements = Array.from(document.querySelectorAll(sel));
        return elements.map(el => ({
          text: el.textContent?.trim(),
          html: el.innerHTML,
          tag: el.tagName,
          attributes: Array.from(el.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {}),
        }));
      },
      args: [selector],
    });

    return results[0]?.result || [];
  } catch (error) {
    console.error('Data extraction error:', error);
    throw error;
  }
}

// Install handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('YuriAI extension installed');
});

