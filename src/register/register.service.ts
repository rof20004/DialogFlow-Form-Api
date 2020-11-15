import { Injectable } from '@nestjs/common';
import * as dialogflow from 'dialogflow';
import * as uuid from 'uuid';
import { CreateConversationDto } from './dto/create-conversation.dto';

const projectId = 'newagent-nogv';
const credentials = {
  client_email: 'rof20004@gmail.com',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvAfCjQlPjAvl6\nt3CKFWzAp8J0ot/KCpLwsm0lU9cJexoQcI2YT7I4R14yi3joKNt4kQilpiukBJGw\np+cv0zDYGHMpJ64vDBV6QvUnd87084rktth0hzIywShGPdzDDwArTNqofpQJeOdt\nFHbZoIgQ6C53qwJ3izmxXr6hr+6RwbZmeSO0iTdsSQArxAXRVqYCEzF0EZ+pmTlQ\nUAFkAmsyR+sab90zMDKH1foT4ybsVShN0pstTsfVWNyVIRNOGjBzKamGSXCfrvLE\nwngCNz0NZTMAmMiENhWaDKbIPgmBnn7DrwRe8wKqqwblxBizRHo28s6pf1Ja12Ga\nGichMC8BAgMBAAECggEAD/e/uKurev/pWqesXGL8TV85JDp8rAL3OYA0KnbZ/NbX\nL9cPKk2iO5WSbA7y+Q7KSJfGF9QfsPtMPjexpbjRoPPpJQEGeOsztfgwRVm+f7XN\nb1UaDpbLzxr15WPNVdxTZgABBuTmta8LAZY/ileF9rHylG9dXiItQUhdYSQL4s9I\nthuq0opq4DFxE/VfzVgbKjJ0kAnLd6c2tVEmUOonJ+4+r9lDfCQp3r6xkiA18GC6\nGm75ZmeyE/jzjY3PSodZoEVdvuXZfUxJeRi3983dSReFF66LW0gYH2Ws5koTyC+w\n8MYFhZWKHY5+pCEpGRNIEQmOirlN4MAl9fgpx7Ds2QKBgQDqMjYkKAF84uv/Eo7S\nIJ+T4IJa1bUisxLn+WUzyxJBJ8tLx7l5gUnDF5zG2QF0Z1CZzaBgWI+104IHgVHy\nsNLxz3vANK0E6CfPh5LONLsTi4PXC7e594ErA+GeF9g2d+GZKePG/PMieDyxDJOS\n+tMhi91+F/oC+bUfOnQ2ShB3+QKBgQC/TQn92rSWq+Cr/g0MkneMTcDcwyzPsxJn\nmbiFH+NuEjJ8/pl/mK1vmPTU8bboxlTIKWb0YjWXQ2C5N5sYkpc0ozgtdB0LL3sT\nD6A+2hLV1qKVX/vRbUTKU/1ED2duny4J0N+L+zBpJgxZ/DJm1QqAGcCiax09hkLu\njwOxn7YBSQKBgEuGm903JZuv1qmww2xSZwQagA9pIfwpwewbip6UW7O1cKNkqpTb\ns/z9jWq3KvfuJZkkLhdEGDxsFF/1PYdFrRGcdu06T53ofIY504c6jCY2dPMR7VNE\n1VwY6VbBm9GdAZ0SXEmc44/3NKNoSeM5joMgBvMWKmNxQg7rG/UyF3OJAoGBAJyc\noGJv60oyukN0QBCb1D1L5mmVa5k6fAXOxk5ONe4F/clw0g+w2cQ0D7RJkrnsrLoV\nkxDdWgxU/9mCWXn7gMh6G2Ky3ZgrrfGD6GesNqFUD1SE+O6SKzANJJnUlpPsw08L\n7gd2hEKBALmmi0i+ftMywg717EFTKnaNJLQFEYbpAoGBAMxm46fK/vUpro5wKH3M\nWM3McooUzf1B6AKVvvsDYxgrdVK/Y1MNOlJjEQqH+ExcJd06nkPsPMOqYdgQAeFb\n8uY12FvvVyx/J+ysmiX8NZHQsZVNbvCF+tSzAIz4Vss5yfzEK5F7dVc/2SMFWAjc\nM4G80Q+uMqVLz3/Sqa3ZMGwy\n-----END PRIVATE KEY-----\n',
};

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
    return Promise.resolve(
      new dialogflow.SessionsClient({
        projectId,
        credentials,
      }),
    );
  }

  private async createSessionPath (sessionClient: any): Promise<any> {
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    return Promise.resolve(sessionPath);
  }
}
