import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

export class AdminGuard extends AuthGuard('jwt') {
  constructor(private reflector = new Reflector()) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    
    // Check if user has admin role
    if (!user.role || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw new UnauthorizedException('Admin access required');
    }
    
    return user;
  }
}
