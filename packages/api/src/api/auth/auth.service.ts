import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(user, password)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        handle: user.handle,
        status: user.status,
        disclosureLevel: user.disclosureLevel,
      },
    };
  }

  async register(email: string, password: string, handle: string, disclosureLevel: 'OPEN' | 'STEALTH' = 'STEALTH') {
    // Check if email or handle already exists
    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already in use');
    }
    
    const existingHandle = await this.usersService.findByHandle(handle);
    if (existingHandle) {
      throw new Error('Handle already in use');
    }
    
    // Create user
    const user = await this.usersService.create({
      email,
      password,
      handle,
      disclosureLevel,
    });
    
    // Return token and user info
    const { passwordHash, ...result } = user;
    return this.login(result);
  }

  async validateAdminUser(email: string, password: string): Promise<any> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
    });
    
    if (admin && await bcrypt.compare(password, admin.passwordHash)) {
      const { passwordHash, ...result } = admin;
      return result;
    }
    return null;
  }

  async adminLogin(admin: any) {
    const payload = { email: admin.email, sub: admin.id, role: admin.role };
    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
