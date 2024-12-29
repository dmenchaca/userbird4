import { CONFIG } from './config';
import { Logger } from './logger';

interface FeedbackPayload {
  formId: string;
  message: string;
}

export async function submitFeedback({ formId, message }: FeedbackPayload) {
  const origin = window.location.origin;
  
  Logger.debug('Submitting feedback:', {
    formId,
    origin,
    url: `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.FEEDBACK}`
  });

  const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.FEEDBACK}`, {
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

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Network error' }));
    Logger.error('Response error:', data);
    throw new Error(data.error || 'Failed to submit feedback');
  }
  
  return response.json();
}