import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bot } from './entities/bot.entity';
import { Repository } from 'typeorm';
import { AddBotDto } from './dto/add-bot.dto';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Role } from './entities/role.entity';
import { UserRoles } from './entities/user-roles.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Bot)
    private botRepository: Repository<Bot>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRoles)
    private userRolesRepository: Repository<UserRoles>,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async addBot(addBotDto: AddBotDto) {
    const ifHasBot = await this.botRepository.findOne({
      where: { userId: addBotDto.userId },
    });
    if (ifHasBot) {
      throw new Error('Бот с таким UserId уже есть в базе данных');
    } else {
      return this.botRepository.save(addBotDto);
    }
  }

  async signUp(regiterDto: RegisterDto) {
    const { login, password } = regiterDto;

    const isUserAlradyExist = await this.usersRepository.findOne({
      where: { login },
    });

    if (isUserAlradyExist) {
      throw new BadGatewayException('User already exist');
    }

    const userRole = await this.roleRepository.findOne({
      where: { value: 'USER' },
    });

    console.log(userRole);

    if (!userRole) {
      throw new Error('Role USER not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      password: hashedPassword,
      login,
    });
    await this.usersRepository.save(user);

    const userRoles = await this.userRolesRepository.create({
      role: userRole,
      user: user,
    });

    await this.userRolesRepository.save(userRoles);
    const token = this.jwtService.sign(
      { id: user.id, sub: user.id },
      { expiresIn: '365d' },
    );
    const { password: _, ...userWithoutPassword } = user;
    return { token, ...userWithoutPassword };
  }
  getBots() {
    return this.botRepository.find();
  }

  async login(loginDto: RegisterDto) {
    const user = await this.usersRepository.findOne({
      where: { login: loginDto.login },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const userRole = await this.userRolesRepository.find({
      where: { user },
      relations: ['role'],
    });

    if (!userRole) {
      throw new Error('Role not found');
    }

    const token = this.jwtService.sign(
      { id: user.id, sub: user.id },
      { expiresIn: '365d' },
    );
    const { password: _, ...userWithoutPassword } = user;
    return {
      token,
      role: userRole.map((r) => r.role.value),
      ...userWithoutPassword,
    };
  }

  async getUserByToken(token: string) {
    try {
      const decodedToken = jwt.decode(token);
      if (decodedToken) {
        const userId = decodedToken['id'];
        const user = await this.usersRepository.findOne({
          where: { id: userId },
        });
        const userRole = user
          ? await this.userRolesRepository.find({
              where: { user },
              relations: ['role'],
            })
          : null;
        const userwithRoles = {
          ...user,
          password: undefined,
          role: userRole?.map((r) => r.role.value),
        };
        return userwithRoles;
      } else {
        console.log('Invalid token');
      }
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error');
    }
  }

  addTokensToCookie(res: Response, accessToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none', // Необходимо для кросс-доменных запросов
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      domain: 'debrabebra.top', // Используем общий домен, чтобы куки были доступны на всех поддоменах
      path: '/',
    });
  }

  async getUsers() {
    const users = await this.usersRepository.find({});
    const usersWithRoles = await this.userRolesRepository.find({
      relations: ['role', 'user'],
    });
    const usersAllWithRoles = users.map((user) => {
      const userWithRoles = usersWithRoles.filter(
        (userRole) => userRole.user.id === user.id,
      );

      console.log('userWithRoles', userWithRoles);
      return { ...user, role: userWithRoles.map((r) => r.role.value) };
    });
    return usersAllWithRoles;
  }

  async addRole(role) {
    console.log(role);
    const roleExist = await this.roleRepository.findOne({
      where: { value: role },
    });
    if (roleExist) {
      throw new Error('Role already exist');
    } else {
      const newRole = this.roleRepository.create({ value: role });
      return this.roleRepository.save(newRole);
    }
  }

  async deleteRoleWorker(userId: string) {
    const roleId = '2';
    const userRole = await this.userRolesRepository.findOne({
      where: { user: { id: userId }, role: { id: roleId } },
    });

    if (userRole) {
      await this.userRolesRepository.remove(userRole);
    } else {
      throw new Error('Role not found for the given user');
    }
  }

  async addRoleWorker(userId: string) {
    const roleId = '2';
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const role = await this.roleRepository.findOne({ where: { id: roleId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (!role) {
      throw new Error('Role not found');
    }

    const userRole = await this.userRolesRepository.create({
      user: user,
      role: role,
    });

    await this.userRolesRepository.save(userRole);
  }
}
