import * as NodeMailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class MessageGateway {
  abstract send(data: EmailDTO): Promise<void | any>;
}

@Injectable()
export class MailerService implements MessageGateway {
  /**
   * Send an email
   * @param data
   * @returns
   */

  private transpoter = NodeMailer.createTransport({
    // service: "Gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  send = async (data: EmailDTO): Promise<any> => {
    const response = await this.transpoter.sendMail({
      from: `"HJ Marketplace" <${process.env.SENDER_EMAIL}>`,
      to: data.email,
      subject: data.title,
      html: data.text,
      //   text: data.text,
    });
    console.log({ emailResponse: response });
    return response;
  };
}
