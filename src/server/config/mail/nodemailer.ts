import { ReadStream } from 'node:fs';
import { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import { config } from '@config/logger/load-envs';
import { logger } from '@config/logger/load-logger';

export class Mailer {
  private _transporter: Transporter;

  constructor() {
    this._transporter = createTransport({
      host: config.MAIL_HOST,
      port: config.MAIL_PORT,
      secure: true,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASSWORD
      }
    });
  }

  async sendNotification(
    to: string,
    cc: string,
    subject: string,
    text: string,
    attachments: { filename: string; content: ReadStream | string }[] = []
  ): Promise<boolean> {
    try {
      // TODO: Change from
      const response = await this._transporter.sendMail({
        from: 'bryan.solares@claro.com.gt',
        to,
        cc,
        subject,
        html: text,
        attachments: attachments?.length > 0 ? attachments : []
      });

      logger().info({
        message: `Notification sent to ${to}`,
        date: new Date(),
        type: subject,
        response
      });

      return true;
    } catch (error) {
      logger().error({
        message: 'Error sending notification',
        error
      });
      return false;
    }
  }
}
