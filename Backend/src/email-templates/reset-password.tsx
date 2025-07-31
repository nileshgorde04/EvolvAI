interface EmailTemplateProps {
  validationCode: string;
}

export const EvolvAiResetPasswordEmailHTML = ({ validationCode }: EmailTemplateProps): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #4A5568; }
        .code { font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; padding: 10px; background-color: #f0f0f0; border-radius: 5px; text-align: center; }
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
    </body>
    </html>
  `;
};