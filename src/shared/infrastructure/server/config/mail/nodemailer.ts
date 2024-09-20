import { ReadStream } from 'node:fs';
import { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import { config } from '@src/shared/infrastructure/server/config/env/envs';
import WinstonLogger from '@contexts/shared/infrastructure/WinstonLogger';

export class Mailer {
  private _transporter: Transporter;
  private logger: WinstonLogger;

  constructor() {
    this.logger = new WinstonLogger();
    this._transporter = createTransport({
      host: config.MAIL.MAIL_HOST,
      port: config.MAIL.MAIL_PORT,
      secure: true,
      auth: {
        user: config.MAIL.MAIL_USER,
        pass: config.MAIL.MAIL_PASSWORD
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
      await this._transporter.sendMail({
        from: 'bryan.solares@claro.com.gt',
        to,
        cc,
        subject,
        html: text,
        attachments: attachments?.length > 0 ? attachments : []
      });

      // this.logger.info({
      //   message: `Notification sent to ${to}`,
      //   date: new Date(),
      //   type: subject,
      //   response
      // });

      return true;
    } catch (error) {
      // this.logger.error({
      //   message: 'Error sending notification',
      //   error
      // });
      return false;
    }
  }
}
