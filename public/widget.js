// Userbird Widget
(function() {
  const API_BASE_URL = 'https://userbird.netlify.app';
  
  const Logger = {
    debug: (message, ...args) => console.log(`[Userbird Debug] ${message}`, ...args),
    error: (message, ...args) => console.error(`[Userbird Error] ${message}`, ...args)
  };

  async function submitFeedback(formId, message) {
    const origin = window.location.origin;
    Logger.debug('Submitting feedback:', {
      formId,
      origin,
      url: `${API_BASE_URL}/.netlify/functions/feedback`
    });

    try {
      const response = await fetch(`${API_BASE_URL}/.netlify/functions/feedback`, {
        method: 'POST',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': origin
        },
        mode: 'cors',
        body: JSON.stringify({ formId, message })
      });

      Logger.debug('Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        Logger.error('Response error:', data);
        throw new Error(data.error || 'Failed to submit feedback');
      }
      
      return response.json();
    } catch (error) {
      Logger.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  // Core widget functionality
  const UserBirdWidget = {
    formId: null,
    state: 'normal',
    elements: {
      modal: null,
      backdrop: null,
      trigger: null,
      submitButton: null,
      textarea: null,
      errorElement: null,
      successElement: null,
      formElement: null
    },

    async init(config) {
      Logger.debug('Initializing widget with config:', config);
      this.formId = config.formId;
      if (!this.formId) {
        Logger.error('No form ID provided');
        return;
      }

      this.injectStyles();
      await this.createElements();
      this.setupEventListeners();
      Logger.debug('Widget initialized');
    },

    // ... rest of the widget code remains the same
  };

  // Initialize the widget
  const formId = window.UserBird?.formId;
  Logger.debug('Starting widget initialization with formId:', formId);
  UserBirdWidget.init({ formId }).catch(error => {
    Logger.error('Failed to initialize widget:', error);
  });
})();