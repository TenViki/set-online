import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { MailerService } from "@nestjs-modules/mailer";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private mailerService: MailerService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/test")
  async test() {
    await this.mailerService.sendMail({
      to: "viktorkomarek28@gmail.com",
      subject: "Test",
      template: "reset-password",
      context: {
        message: new Date().toDateString(),
      },
    });
  }
}
