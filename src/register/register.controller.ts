import { Controller, Get } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('/api/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Get()
  async welcome (): Promise<any> {
    return await this.registerService.welcome();
  }
}
