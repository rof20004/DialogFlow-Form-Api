import { Injectable } from '@nestjs/common';
import * as dialogflow from 'dialogflow';
import * as uuid from 'uuid';

@Injectable()
export class RegisterService {
  async welcome (): Promise<any> {
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath('newagent-nogv', sessionId);

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
}
