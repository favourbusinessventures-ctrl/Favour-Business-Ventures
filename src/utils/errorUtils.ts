/**
 * Human-Friendly Error System for Favour Business Ventures
 *
 * Translates raw Firebase, network, DOM, and JavaScript runtime errors
 * into clear, polite, and actionable messages for customers and admins.
 * Prevents raw technical jargon (like FirebaseError, permission-denied, TypeError)
 * from ever being exposed to end users.
 */

export interface FormattedError {
  title: string;
  message: string;
  actionText?: string;
  isRetryable: boolean;
}

/**
 * Maps raw technical errors to friendly customer-facing messages
 */
export function formatFriendlyError(error: unknown, fallbackContext = 'operation'): FormattedError {
  if (!error) {
    return {
      title: 'Something went wrong',
      message: `We couldn't complete this ${fallbackContext} right now. Please try again.`,
      actionText: 'Try Again',
      isRetryable: true
    };
  }

  const rawMessage = typeof error === 'string' 
    ? error 
    : (error as any)?.message || (error as any)?.toString() || '';

  const rawCode = (error as any)?.code || '';

  // Network / Connection Drops
  if (
    rawCode.includes('network') ||
    rawCode.includes('unavailable') ||
    rawMessage.includes('Failed to fetch') ||
    rawMessage.includes('NetworkError') ||
    rawMessage.includes('net::ERR_') ||
    rawMessage.includes('offline')
  ) {
    return {
      title: 'Connection interrupted',
      message: 'We were unable to connect to the server. Please check your internet connection and try again.',
      actionText: 'Retry Connection',
      isRetryable: true
    };
  }

  // Permission / Authorization
  if (
    rawCode.includes('permission-denied') ||
    rawCode.includes('unauthenticated') ||
    rawMessage.includes('permission-denied') ||
    rawMessage.includes('unauthorized')
  ) {
    return {
      title: 'Access needs attention',
      message: 'Some information could not be loaded. Please refresh your session or try again.',
      actionText: 'Refresh Page',
      isRetryable: true
    };
  }

  // Resource Not Found
  if (rawCode.includes('not-found') || rawMessage.includes('not found')) {
    return {
      title: 'Item not found',
      message: 'The requested provision or information is currently unavailable.',
      actionText: 'Browse Catalog',
      isRetryable: false
    };
  }

  // Rate Limiting / Resource Exhaustion
  if (rawCode.includes('resource-exhausted') || rawMessage.includes('quota') || rawMessage.includes('rate limit')) {
    return {
      title: 'Please wait a moment',
      message: 'Our service is experiencing high inquiry volume. Please try again in a few seconds.',
      actionText: 'Try Again in 10s',
      isRetryable: true
    };
  }

  // Image Upload / Storage
  if (fallbackContext.includes('image') || fallbackContext.includes('upload')) {
    if (rawMessage.includes('size limit') || rawMessage.includes('10MB')) {
      return {
        title: 'Image file too large',
        message: 'Please choose an image under 10MB to ensure fast loading for customers.',
        actionText: 'Choose Another Image',
        isRetryable: false
      };
    }
    return {
      title: 'Image upload paused',
      message: 'We were unable to save this image right now. Please select the image again and retry.',
      actionText: 'Retry Upload',
      isRetryable: true
    };
  }

  // Customer Care / AI Assistant
  if (fallbackContext.includes('customer care') || fallbackContext.includes('assistant')) {
    return {
      title: 'Customer Care is temporarily unavailable',
      message: 'You can still contact us directly on WhatsApp for instant assistance.',
      actionText: 'Chat on WhatsApp',
      isRetryable: true
    };
  }

  // Products
  if (fallbackContext.includes('product')) {
    return {
      title: 'Products couldn\'t be loaded',
      message: 'Please try again in a moment or contact us directly on WhatsApp.',
      actionText: 'Reload Products',
      isRetryable: true
    };
  }

  // Reviews
  if (fallbackContext.includes('review')) {
    return {
      title: 'Customer feedback couldn\'t be loaded',
      message: 'We are unable to display customer reviews right now. Please try again.',
      actionText: 'Retry',
      isRetryable: true
    };
  }

  // Generic Safe Fallback
  return {
    title: 'Something went wrong',
    message: 'We couldn\'t load this information right now. Please try again.',
    actionText: 'Try Again',
    isRetryable: true
  };
}
