interface EmailTemplateProps {
  validationCode: string;
}

/**
 * Generates the HTML content for the password reset email.
 * @param validationCode The 6-digit code for the user.
 * @returns A string containing the full HTML of the email.
 */
export const EvolvAiResetPasswordEmailHTML = ({ validationCode }: EmailTemplateProps): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
        h1 { color: #2d3748; }
        .code { 
          font-size: 32px; 
          font-weight: bold; 
          letter-spacing: 4px; 
          margin: 24px 0; 
          padding: 12px; 
          background-color: #f7fafc; 
          border-radius: 8px; 
          text-align: center; 
          color: #4a5568;
        }
        .footer { font-size: 12px; color: #718096; margin-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Your EvolvAI Password</h1>
        <p>Hello,</p>
        <p>We received a request to reset the password for your EvolvAI account. Please use the following 6-digit code to complete the process. This code will expire in 10 minutes.</p>
        <h2>Your verification code is:</h2>
        <div class="code">${validationCode}</div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,<br/>The EvolvAI Team</p>
      </div>
      <div class="footer">
        <p>EvolvAI | Evolve your life.</p>
      </div>
    </body>
    </html>
  `;
};
