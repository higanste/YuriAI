// Popup script for Rtrvr extension

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
        content: `You are an AI web agent that can interact with web pages. 

Current page: ${pageInfo.url}
Page title: ${pageInfo.title}

You can perform these actions:
1. Click elements: {"action": "click", "selector": "button.search, #submit-btn, .nav-link"}
2. Type text: {"action": "type", "selector": "input[name='q'], #search-box", "text": "your text here"}
3. Extract data: {"action": "extract", "selector": ".results, a, h1, p"}
4. Navigate: {"action": "navigate", "url": "https://example.com"}

IMPORTANT: 
- Use common CSS selectors (id, class, tag, attribute)
- For buttons, try: button, .btn, [type="submit"], #button-id
- For inputs, try: input, textarea, [type="text"], input[name="q"]
- For links, try: a, .link, a[href*="search"]
- Always provide a valid CSS selector
- If you can't determine the selector, explain what the user should do

Respond ONLY with valid JSON when an action is needed, or plain text for explanations.`
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
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(currentTab.id, { action: 'getPageInfo' }, (response) => {
      resolve(response || { url: currentTab.url, title: currentTab.title, text: '' });
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

