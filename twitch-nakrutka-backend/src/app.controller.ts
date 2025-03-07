import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AddBotDto } from './dto/add-bot.dto';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/addBot')
  async addBot(@Body() addBotDto: AddBotDto, @Res() res: Response) {
    try {
      const bot = await this.appService.addBot(addBotDto);
      return res
        .status(200)
        .json({ bot, message: 'Бот был успешно добавлен!' });
    } catch (error) {
      return res.status(500).json({ error: error.message || error });
    }
  }

  @Get('/getBots')
  async getBots(@Res() res: Response) {
    try {
      const bots = await this.appService.getBots();
      return res.status(200).json({ bots });
    } catch (error) {
      return res.status(500).json({ error: error.message || error });
    }
  }

  @Post('/register')
  async register(
    @Body() signUpDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.appService.signUp(signUpDto);

    this.appService.addTokensToCookie(res, response.token);
    const responseCopy = { ...response, token: undefined };
    return responseCopy;
  }

  @Post('/login')
  async login(
    @Body() loginDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.appService.login(loginDto);

    this.appService.addTokensToCookie(res, response.token);
    const responseCopy = { ...response, token: undefined };
    return responseCopy;
  }

  @Get('/user')
  async getUserByToken(@Request() req, @Res() res: Response) {
    try {
      const token = req.cookies['access_token'];
      const response = await this.appService.getUserByToken(token);

      if (!response) {
        return res.status(401).json({ error: 'Пользователь не найден' });
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Ошибка сервера' });
    }
  }

  @Get('/users')
  async getUsers(@Res() res: Response) {
    try {
      const users = await this.appService.getUsers();
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: error.message || error });
    }
  }

  @Patch('/deleteRoleWorker')
  async deleteRoleWorker(
    @Body() body: { userId: string },
    @Res() res: Response,
  ) {
    try {
      const user = await this.appService.deleteRoleWorker(body.userId);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: error.message || error });
    }
  }

  @Patch('/addRoleWorker')
  async addRoleWorker(@Body() body: { userId: string }, @Res() res: Response) {
    try {
      console.log(body);
      const user = await this.appService.addRoleWorker(body.userId);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: error.message || error });
    }
  }

  @Post('/addRole')
  async addRole(@Body() body: { role: string }, @Res() res: Response) {
    try {
      const role = await this.appService.addRole(body.role);
      return res.status(200).json({ role });
    } catch (error) {
      return res.status(500).json({ error: error.message || error });
    }
  }
}
