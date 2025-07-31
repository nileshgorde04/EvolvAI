import { Resend } from 'resend';
import { EvolvAiResetPasswordEmailHTML } from '../email-templates/reset-password'; // Import the new HTML template

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  resetCode: string;
}

export const sendPasswordResetEmail = async ({ to, subject, resetCode }: EmailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'EvolvAI <onboarding@resend.dev>', // Required by Resend's free tier
      to: [to],
      subject: subject,
      // Use the 'html' property with our new HTML string function
      html: EvolvAiResetPasswordEmailHTML({ validationCode: resetCode }),
    });

    if (error) {
      console.error("Error sending email via Resend:", error);
      throw new Error("Email could not be sent.");
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Caught an exception in sendPasswordResetEmail:", error);
    throw error; // Re-throw the error to be caught by the controller
  }
};
