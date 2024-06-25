import { Injectable } from '@nestjs/common';
import { MessageGateway } from './message.gateway';

export enum MessageChannels {
  NODE_MAILER = 'nodeMailer',
  SENDGRID = 'sendgrid',
}

@Injectable()
export default class MessageService {
  private messageChannels: Record<string, MessageGateway> = {};

  public registerChannel = (
    messageChannel: MessageChannels,
    channel: MessageGateway,
  ) => {
    this.messageChannels[messageChannel] = channel;
  };

  public sendMessage = async (
    data: EmailDTO,
    messageChannel: MessageChannels,
  ): Promise<void | any> => {
    const channel = this.messageChannels[messageChannel];
    if (channel) {
      return await channel.send(data);
    }
  };
}
