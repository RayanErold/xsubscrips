import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name?: string) {
  if (!process.env.RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY not found, skipping welcome email');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'X Subscrips <support@xsubscrips.com>',
      to: [email],
      subject: 'Welcome to X Subscrips!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h1 style="color: #6366f1;">Welcome to X Subscrips, ${name || 'there'}!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            We're thrilled to have you on board. X Subscrips is designed to help you take full control of your digital life and save money effortlessly.
          </p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <h3 style="margin-top: 0;">Get Started in 3 Steps:</h3>
            <ol>
              <li><strong>Add your first subscription:</strong> Track your Netflix, Spotify, or any other recurring cost.</li>
              <li><strong>Set up reminders:</strong> Never get caught by a surprise renewal again.</li>
              <li><strong>Check your Analytics:</strong> See exactly where your money is going each month.</li>
            </ol>
          </div>
          <p>If you have any questions, just reply to this email. Our support team is always here to help.</p>
          <p>Best,<br>The X Subscrips Team</p>
          <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 30px 0;">
          <p style="font-size: 12px; color: #71717a; text-align: center;">
            &copy; 2026 X Subscrips. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      logger.error({ error, email }, 'Failed to send welcome email');
    } else {
      logger.info({ id: data?.id, email }, 'Welcome email sent successfully');
    }
  } catch (error) {
    logger.error({ error, email }, 'Error in welcome email service');
  }
}
