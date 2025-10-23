import type { Referral, User } from '../types';

interface Email {
  to: string;
  subject: string;
  body: string;
}

/**
 * Simulates sending an email by logging its content to the console.
 * In a real application, this would be replaced with an actual email API call.
 */
const sendEmail = (email: Email) => {
  console.log(`
    ========================================
    [Mock Email Service] Sending Email
    ----------------------------------------
    To: ${email.to}
    Subject: ${email.subject}
    ----------------------------------------
    Body:
    ${email.body}
    ========================================
  `);
};

/**
 * Generates and "sends" a verification email to a new partner.
 */
export const sendVerificationEmail = (user: User): void => {
  if (!user.verificationToken || !user.email) return;

  const verificationLink = `${window.location.origin}${window.location.pathname}#/verify?token=${user.verificationToken}`;

  const email: Email = {
    to: user.email,
    subject: `Activate Your Accountant's Factory Partner Account`,
    body: `
      Hi ${user.name.split(' ')[0]},

      Welcome to the Accountant's Factory Referral Network!

      To complete your registration and activate your account, please click the link below:
      ${verificationLink}

      If you did not sign up for this account, you can safely ignore this email.

      Best regards,
      The Accountant's Factory Team
    `,
  };
  sendEmail(email);
};


/**
 * Generates and "sends" an email to the admin about a new referral.
 */
export const sendNewReferralAdminNotification = (referral: Referral): void => {
  const email: Email = {
    to: 'admin@accountantsfactory.com',
    subject: `[New Referral] Lead submitted for ${referral.clientName}`,
    body: `
      Hi Admin Team,

      A new referral has been submitted through the partner portal.

      Details:
      - Client Name: ${referral.clientName}
      - Referrer: ${referral.referrerName}
      - Date Submitted: ${referral.dateSubmitted}

      Please review this new lead in the admin dashboard.

      Thank you,
      Accountant's Factory Notification System
    `,
  };
  sendEmail(email);
};

/**
 * Generates and "sends" an email to a partner about a status update on their referral.
 */
export const sendStatusUpdatePartnerNotification = (referral: Referral, partnerEmail: string): void => {
  const email: Email = {
    to: partnerEmail,
    subject: `Update on your referral: ${referral.clientName}`,
    body: `
      Hi ${referral.referrerName},

      There's an update on your referral for ${referral.clientName}.
      The status has been changed to: "${referral.status}".

      You can view the full details on your partner dashboard.

      Best regards,
      The Accountant's Factory Team
    `,
  };
  sendEmail(email);
};

/**
 * Generates and "sends" a payout notification to a partner.
 */
export const sendPayoutPartnerNotification = (referral: Referral, partnerEmail: string): void => {
    const commissionAmount = referral.expectedCommission.toLocaleString('en-IN');
    const email: Email = {
        to: partnerEmail,
        subject: `🎉 Commission Paid for referral ${referral.clientName}!`,
        body: `
            Hi ${referral.referrerName},

            Great news! Your commission of ₹${commissionAmount} for the referral of ${referral.clientName} has been processed and paid out.

            This amount has been added to your "Total Paid Out" balance in your commission wallet.

            Thank you for your continued partnership!

            Best regards,
            The Accountant's Factory Team
        `,
    };
    sendEmail(email);
};