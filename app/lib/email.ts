type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

// Simple console-based email mock
export const sendEmail = async (options: EmailOptions) => {
  console.log('------- EMAIL SENT -------');
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Content: ${options.text}`);
  console.log('-------------------------');
  
  // In a real implementation, you would connect to an email service here
  // For example:
  // - Using fetch to call an email API service
  // - Using a different email library that doesn't have dependency conflicts
  
  return { success: true, messageId: 'mock-id-' + Date.now() };
};
