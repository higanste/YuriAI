// Popup script for YuriAI extension

const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const status = document.getElementById('status');

let isProcessing = false;

// Get current tab
let currentTab;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTab = tabs[0];
});

// Send button click
sendButton.addEventListener('click', handleSend);

// Enter key press
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

async function handleSend() {
  const message = messageInput.value.trim();
  if (!message || isProcessing) return;

  isProcessing = true;
  sendButton.disabled = true;
  messageInput.disabled = true;

  // Clear welcome message
  const welcomeMsg = chatContainer.querySelector('.welcome-message');
  if (welcomeMsg) {
    welcomeMsg.remove();
  }

  // Add user message
  addMessage(message, 'user');
  messageInput.value = '';

  // Show typing indicator
  const typingId = showTypingIndicator();

  try {
    // Get page context
    const pageInfo = await getPageInfo();

    // Prepare messages for AI
    const messages = [
      {
        role: 'system',
        content: `You are YuriAI, an advanced AI web automation agent similar to Retrevr.ai. You can navigate websites, extract data, fill forms, and execute complex workflows.

Current page: ${pageInfo.url}
Page title: ${pageInfo.title}

AVAILABLE ACTIONS (respond with JSON):
1. Click: {"action": "click", "selector": "button.search, #submit-btn, .nav-link"}
2. Type: {"action": "type", "selector": "input[name='q'], #search-box", "text": "your text"}
3. Extract: {"action": "extract", "selector": ".results, a, h1, p"}
4. Navigate: {"action": "navigate", "url": "https://example.com"}
5. Wait: {"action": "wait", "ms": 1000}
6. Scroll: {"action": "scroll", "direction": "down" or "up", "amount": 500}

SELECTOR TIPS:
- Buttons: button, .btn, [type="submit"], #button-id, button:contains("text")
- Inputs: input, textarea, [type="text"], input[name="q"], input[placeholder*="search"]
- Links: a, .link, a[href*="search"], a:contains("text")
- Use multiple selectors separated by commas for fallback

WORKFLOW EXAMPLES:
- "Search for AI videos on YouTube" → Navigate to YouTube, find search box, type, click search
- "Extract all product prices" → Find price elements, extract text
- "Fill this form with my email" → Find email input, type email

IMPORTANT:
- Always respond with valid JSON for actions: {"action": "...", ...}
- For explanations or when unsure, use plain text
- Be specific with selectors - use multiple options when possible
- Think step-by-step for complex tasks`
      },
      {
        role: 'user',
        content: message
      }
    ];

    // Call AI
    const response = await chrome.runtime.sendMessage({
      action: 'chat',
      messages: messages
    });

    removeTypingIndicator(typingId);

    if (response && response.success) {
      addMessage(response.response, 'assistant');

      // Try to parse and execute action if it's JSON
      try {
        // Check if response contains JSON
        const jsonMatch = response.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const actionData = JSON.parse(jsonMatch[0]);
          if (actionData.action && actionData.selector) {
            await executeAction(actionData);
          }
        }
      } catch (e) {
        // Not JSON or invalid JSON, just display the message
        console.log('Response is not an action JSON:', e);
      }
    } else {
      addMessage(`Error: ${response?.error || 'Unknown error'}`, 'error');
    }
  } catch (error) {
    removeTypingIndicator(typingId);
    addMessage(`Error: ${error.message}`, 'error');
    showStatus('Failed to process request', 'error');
  } finally {
    isProcessing = false;
    sendButton.disabled = false;
    messageInput.disabled = false;
    messageInput.focus();
  }
}

function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typing-' + Date.now();
  typingDiv.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return typingDiv.id;
}

function removeTypingIndicator(id) {
  const typing = document.getElementById(id);
  if (typing) {
    typing.remove();
  }
}

function showStatus(text, type = '') {
  status.textContent = text;
  status.className = `status ${type}`;
  setTimeout(() => {
    status.textContent = '';
    status.className = 'status';
  }, 3000);
}

async function getPageInfo() {
  if (!currentTab || !currentTab.id) {
    return { url: '', title: '', text: '' };
  }

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(currentTab.id, { action: 'getPageInfo' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script might not be loaded, use tab info
        resolve({ url: currentTab.url || '', title: currentTab.title || '', text: '' });
      } else {
        resolve(response || { url: currentTab.url || '', title: currentTab.title || '', text: '' });
      }
    });
  });
}

async function executeAction(actionData) {
  if (!currentTab || !currentTab.id) {
    showStatus('No active tab found', 'error');
    return;
  }

  try {
    const result = await chrome.runtime.sendMessage({
      action: 'executeAction',
      actionType: actionData.action,
      tabId: currentTab.id,
      params: {
        selector: actionData.selector,
        text: actionData.text,
        url: actionData.url
      }
    });

    if (result && result.success) {
      showStatus('Action executed successfully', 'success');
      // Optionally add a message about what was done
      if (result.result && result.result.message) {
        addMessage(`✓ ${result.result.message}`, 'assistant');
      }
    } else {
      showStatus(`Action failed: ${result?.error || 'Unknown error'}`, 'error');
    }
  } catch (error) {
    showStatus(`Error executing action: ${error.message}`, 'error');
    console.error('Action execution error:', error);
  }
}

