import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Try to find by username first, then by email for backward compatibility
    let user = await this.usersService.findByUsername(username);
    if (!user) {
      user = await this.usersService.findByEmail(username);
    }
    
    if (user && await this.usersService.validatePassword(user, password)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.handle, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.handle,
        email: user.email,
        status: user.status,
        disclosureLevel: user.disclosureLevel,
      },
    };
  }

  async register(dto: RegisterDto) {
    // Check if username or email already exists
    const existingUsername = await this.usersService.findByUsername(dto.username);
    if (existingUsername) {
      throw new BadRequestException('Username already in use');
    }
    
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) {
      throw new BadRequestException('Email already in use');
    }
    
    // Create user with username as handle
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      handle: dto.username, // Use username as handle
      disclosureLevel: 'STEALTH', // Default to stealth
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
