/**
 * Chatbot Widget Script - JSONP Version
 * Handles all chat functionality using JSONP to avoid CORS issues
 */

// Configuration - Update this URL with your Google Apps Script deployment
const CHATBOT_CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxTJ1gECETY1Fz7GhQeOKl6qX7OJ_5SwxEQbSpULotWe1l01F93toQTZ20XVJpTA0ALWw/exec',
    RATE_LIMIT_COOLDOWN: 2000, // 2 seconds between messages
    MAX_MESSAGE_LENGTH: 500,
    REQUEST_TIMEOUT: 15000, // 15 seconds timeout
    DEBUG: false // Set to true for console logging
};

// Global variables
let chatWidget = {
    isInitialized: false,
    lastResponseType: "normal",
    lastMessageTime: 0,
    elements: {},
    activeRequests: new Set() // Track active JSONP requests
};

/**
 * Initialize the chatbot when DOM is ready
 */
function initializeChatbot() {
    if (chatWidget.isInitialized) return;
    
    // Get DOM elements
    chatWidget.elements = {
        container: document.getElementById('chat-widget-container'),
        button: document.getElementById('chat-widget-button'),
        widget: document.getElementById('chat-widget'),
        close: document.getElementById('chat-widget-close'),
        messages: document.getElementById('chat-messages'),
        input: document.getElementById('chat-input'),
        send: document.getElementById('chat-send')
    };
    
    // Check if required elements exist
    if (!chatWidget.elements.container || !chatWidget.elements.button) {
        console.error('Chatbot: Required elements not found. Make sure to include the HTML structure.');
        return;
    }
    
    // Set up event listeners
    setupEventListeners();
    
    chatWidget.isInitialized = true;
    log('Chatbot initialized successfully');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    const { button, widget, close, input, send } = chatWidget.elements;
    
    // Toggle chat widget
    button.addEventListener('click', toggleChatWidget);
    
    // Close chat widget
    close.addEventListener('click', closeChatWidget);
    
    // Send message on button click
    send.addEventListener('click', handleSendMessage);
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Auto-resize input field
    input.addEventListener('input', autoResizeInput);
    
    // Close widget when clicking outside
    document.addEventListener('click', function(e) {
        if (widget.classList.contains('active') && 
            !chatWidget.elements.container.contains(e.target)) {
            closeChatWidget();
        }
    });
    
    // Prevent widget from closing when clicking inside it
    widget.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

/**
 * Toggle chat widget visibility
 */
function toggleChatWidget() {
    const widget = chatWidget.elements.widget;
    const isActive = widget.classList.contains('active');
    
    if (isActive) {
        closeChatWidget();
    } else {
        openChatWidget();
    }
}

/**
 * Open chat widget
 */
function openChatWidget() {
    const { widget, input, messages } = chatWidget.elements;
    
    widget.classList.add('active');
    
    // Focus input field after animation
    setTimeout(() => {
        input.focus();
    }, 300);
    
    // Add welcome message if chat is empty
    if (messages.children.length === 0) {
        addMessage("Hello! I'm your knowledge base assistant. Ask me anything about our products or services.", false);
    }
    
    log('Chat widget opened');
}

/**
 * Close chat widget
 */
function closeChatWidget() {
    const widget = chatWidget.elements.widget;
    widget.classList.remove('active');
    document.body.classList.remove('hide-website-cursor');
    log('Chat widget closed');
}

/**
 * Handle send message
 */
function handleSendMessage() {
    const input = chatWidget.elements.input;
    const text = input.value.trim();
    
    if (!text) return;
    
    // Validate message length
    if (text.length > CHATBOT_CONFIG.MAX_MESSAGE_LENGTH) {
        addMessage(`Message too long. Please keep it under ${CHATBOT_CONFIG.MAX_MESSAGE_LENGTH} characters.`, false, 'error-msg');
        return;
    }
    
    // Check rate limiting
    if (isRateLimited()) {
        addMessage("Please wait a moment before sending another message.", false, 'error-msg');
        return;
    }
    
    // Clear input and add user message
    input.value = '';
    autoResizeInput();
    addMessage(text, true);
    
    // Update rate limiting
    chatWidget.lastMessageTime = Date.now();
    
    // Process the message
    processMessage(text);
}

/**
 * Check if rate limited
 */
function isRateLimited() {
    const now = Date.now();
    return (now - chatWidget.lastMessageTime) < CHATBOT_CONFIG.RATE_LIMIT_COOLDOWN;
}

/**
 * Process user message
 */
async function processMessage(text) {
    const { lastResponseType } = chatWidget;
    
    // Handle contact flow
    if (lastResponseType === "offer_contact") {
        if (text.toLowerCase().includes("yes")) {
            await handleContactRequest();
            return;
        } else if (text.toLowerCase().includes("no")) {
            addMessage("What else would you like to know?", false);
            chatWidget.lastResponseType = "normal";
            return;
        }
    }
    
    // Normal query processing
    showTypingIndicator();
    
    try {
        const response = await sendToAPI(text);
        
        hideTypingIndicator();
        
        if (response.error) {
            addMessage("Sorry, I encountered an error. Please try again.", false, 'error-msg');
            log('API Error:', response.error);
        } else if (response.response) {
            // Check if this triggers contact flow
            if (response.response.includes("I don't have that information in my database. Would you like to contact our representative?")) {
                chatWidget.lastResponseType = "offer_contact";
            }
            
            addMessage(response.response, false);
        } else {
            addMessage("Sorry, I didn't receive a valid response. Please try again.", false, 'error-msg');
        }
        
    } catch (error) {
        hideTypingIndicator();
        addMessage("Sorry, I couldn't connect to the assistant. Please check your internet connection and try again.", false, 'error-msg');
        log('Connection Error:', error);
    }
}

/**
 * Handle contact information request using JSONP
 */
async function handleContactRequest() {
    showTypingIndicator();
    
    try {
        const response = await sendJSONPRequest('contact');
        
        hideTypingIndicator();
        
        if (response.response) {
            addMessage(response.response, false, 'success-msg');
        } else {
            addMessage("Sorry, I couldn't retrieve the contact information.", false, 'error-msg');
        }
        
        chatWidget.lastResponseType = "normal";
        
    } catch (error) {
        hideTypingIndicator();
        addMessage("Sorry, I couldn't retrieve the contact information.", false, 'error-msg');
        chatWidget.lastResponseType = "normal";
        log('Contact Error:', error);
    }
}

/**
 * Send message to API using JSONP (CORS-free solution)
 */
function sendToAPI(message) {
    return sendJSONPRequest('query', message);
}

/**
 * Generic JSONP request function
 */
function sendJSONPRequest(action, data = null) {
    return new Promise((resolve, reject) => {
        // Create a unique callback name
        const callbackName = 'chatbot_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Track this request
        chatWidget.activeRequests.add(callbackName);
        
        // Create the callback function
        window[callbackName] = function(response) {
            // Clean up
            cleanup();
            resolve(response);
        };
        
        // Build URL with parameters
        let url = CHATBOT_CONFIG.APPS_SCRIPT_URL + '?callback=' + encodeURIComponent(callbackName);
        
        if (action === 'contact') {
            url += '&action=contact';
        } else if (action === 'query' && data) {
            url += '&query=' + encodeURIComponent(data);
        }
        
        // Create script element for JSONP
        const script = document.createElement('script');
        script.src = url;
        script.id = callbackName;
        
        // Handle errors
        script.onerror = function() {
            cleanup();
            reject(new Error('Failed to connect to chatbot service'));
        };
        
        // Set up timeout
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error('Request timeout - please try again'));
        }, CHATBOT_CONFIG.REQUEST_TIMEOUT);
        
        // Cleanup function
        function cleanup() {
            clearTimeout(timeout);
            chatWidget.activeRequests.delete(callbackName);
            
            if (window[callbackName]) {
                delete window[callbackName];
            }
            
            const scriptElement = document.getElementById(callbackName);
            if (scriptElement && scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
            }
        }
        
        // Override callback to include cleanup
        const originalCallback = window[callbackName];
        window[callbackName] = function(data) {
            clearTimeout(timeout);
            originalCallback(data);
        };
        
        // Add script to DOM to trigger request
        document.head.appendChild(script);
        
        log('JSONP request sent:', action, data ? data.substring(0, 50) + '...' : '');
    });
}

/**
 * Add message to chat
 */
function addMessage(text, isUser, extraClass = '') {
    const messagesDiv = chatWidget.elements.messages;
    const div = document.createElement('div');
    
    const className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'} ${extraClass}`.trim();
    div.className = className;
    div.textContent = text;
    
    messagesDiv.appendChild(div);
    scrollToBottom();
    
    log(`Message added: ${isUser ? 'User' : 'Bot'} - ${text.substring(0, 50)}...`);
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const messagesDiv = chatWidget.elements.messages;
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typing-indicator';
    
    // Create animated dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'typing-dots';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        dotsContainer.appendChild(dot);
    }
    
    div.appendChild(dotsContainer);
    messagesDiv.appendChild(div);
    scrollToBottom();
    
    // Disable send button while typing
    chatWidget.elements.send.disabled = true;
    chatWidget.elements.send.classList.add('loading');
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
    
    // Re-enable send button
    chatWidget.elements.send.disabled = false;
    chatWidget.elements.send.classList.remove('loading');
}

/**
 * Auto-resize input field
 */
function autoResizeInput() {
    const input = chatWidget.elements.input;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
}

/**
 * Scroll messages to bottom
 */
function scrollToBottom() {
    const messagesDiv = chatWidget.elements.messages;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Debug logging
 */
function log(...args) {
    if (CHATBOT_CONFIG.DEBUG) {
        console.log('[Chatbot]', ...args);
    }
}

/**
 * Cleanup function for page unload
 */
function cleanup() {
    // Cancel all active requests
    chatWidget.activeRequests.forEach(callbackName => {
        if (window[callbackName]) {
            delete window[callbackName];
        }
        
        const scriptElement = document.getElementById(callbackName);
        if (scriptElement && scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
        }
    });
    
    chatWidget.activeRequests.clear();
}

/**
 * Public API for configuration
 */
window.ChatbotWidget = {
    init: initializeChatbot,
    config: CHATBOT_CONFIG,
    open: openChatWidget,
    close: closeChatWidget,
    addMessage: addMessage,
    cleanup: cleanup
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    // DOM is already loaded
    initializeChatbot();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        log('Page became visible');
    } else {
        log('Page became hidden');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
window.addEventListener('unload', cleanup);