import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {}

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
