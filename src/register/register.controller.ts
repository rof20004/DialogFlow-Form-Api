import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { RegisterService } from './register.service';

@Controller('/api/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Get('/welcome')
  async welcome (): Promise<any> {
    return await this.registerService.welcome();
  }

  @Post('/conversation')
  async conversation (
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<any> {
    return await this.registerService.conversation(createConversationDto);
  }
}
