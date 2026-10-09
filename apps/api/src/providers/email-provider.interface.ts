export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Transactional e-mail (password reset codes). Production: ResendEmailProvider when
 * RESEND_API_KEY is set. Otherwise LogEmailProvider, which only logs that a message
 * would have been sent — never its content, since it carries one-time codes.
 */
export interface EmailProvider {
  /** True when messages actually reach the recipient. */
  readonly delivers: boolean;
  send(message: EmailMessage): Promise<void>;
}

export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');
