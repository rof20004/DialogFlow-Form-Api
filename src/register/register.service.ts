import { Injectable } from '@nestjs/common';
import * as dialogflow from 'dialogflow';
import * as uuid from 'uuid';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class RegisterService {
  async welcome (): Promise<any> {
    const sessionClient = await this.createSessionClient();
    const sessionPath = await this.createSessionPath(sessionClient);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: 'Oi',
          languageCode: 'pt-BR',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);

    return {
      text: responses[0].queryResult.fulfillmentText,
      buffer: responses[0].outputAudio,
    };
  }

  async conversation (
    createConversationDto: CreateConversationDto,
  ): Promise<any> {
    const sessionClient = await this.createSessionClient();
    const sessionPath = await this.createSessionPath(sessionClient);

    const { text, context } = createConversationDto;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: 'pt-BR',
        },
      },
      queryParams: {
        contexts: context,
      },
    };

    const responses = await sessionClient.detectIntent(request);

    return {
      text: responses[0].queryResult.fulfillmentText,
      context: responses[0].queryResult.outputContexts,
      buffer: responses[0].outputAudio,
    };
  }

  private async createSessionClient (): Promise<any> {
    return Promise.resolve(new dialogflow.SessionsClient());
  }

  private async createSessionPath (sessionClient: any): Promise<any> {
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.sessionPath('newagent-nogv', sessionId);
    return Promise.resolve(sessionPath);
  }
}
