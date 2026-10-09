import { Logger } from '@nestjs/common';
import type { EmailMessage, EmailProvider } from '../email-provider.interface';

/** Sends e-mail through the Resend HTTP API (https://resend.com). */
export class ResendEmailProvider implements EmailProvider {
  readonly delivers = true;
  private readonly logger = new Logger(ResendEmailProvider.name);

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: this.from, to: [message.to], subject: message.subject, text: message.text, html: message.html }),
    });
    if (!response.ok) {
      // The body may echo the request; log only the status.
      this.logger.error(`Resend refused the message (HTTP ${response.status})`);
      throw new Error(`E-mail delivery failed (HTTP ${response.status})`);
    }
  }
}
