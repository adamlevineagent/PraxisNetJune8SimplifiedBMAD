import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.user.findMany({
      where,
      include: {
        profile: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async findByHandle(handle: string) {
    return this.prisma.user.findUnique({
      where: { handle },
      include: {
        profile: true,
      },
    });
  }

  async findByUsername(username: string) {
    // Username is stored as handle in the database
    return this.findByHandle(username);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, handle, disclosureLevel } = createUserDto;
    
    // Check if email or handle already exists
    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already in use');
    }
    
    const existingHandle = await this.findByHandle(handle);
    if (existingHandle) {
      throw new Error('Handle already in use');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        handle,
        username: handle, // Default username to handle
        disclosureLevel,
        status: 'PENDING',
        onboardingStage: 'HANDLE_SELECTION',
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { handle, disclosureLevel, status } = updateUserDto;
    
    // If handle is being updated, check if it's already in use
    if (handle) {
      const existingHandle = await this.findByHandle(handle);
      if (existingHandle && existingHandle.id !== id) {
        throw new Error('Handle already in use');
      }
    }
    
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(handle && { handle }),
        ...(disclosureLevel && { disclosureLevel }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'INACTIVE') {
    return this.prisma.user.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getProfile(userId: string) {
    return this.prisma.agentProfile.findUnique({
      where: { userId },
    });
  }

  async updateProfile(userId: string, positionMatrix: any) {
    // Check if profile exists
    const existingProfile = await this.getProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      return this.prisma.agentProfile.update({
        where: { userId },
        data: {
          positionMatrix,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new profile
      return this.prisma.agentProfile.create({
        data: {
          userId,
          positionMatrix,
        },
      });
    }
  }

  async getOpportunities(userId: string, status?: string) {
    const where = {
      userId,
      ...(status && { status: status as any }),
    };
    
    return this.prisma.opportunityMatch.findMany({
      where,
      include: {
        targetUser: {
          select: {
            handle: true,
            disclosureLevel: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateOpportunityStatus(
    id: string,
    userId: string,
    status: 'INTERESTED' | 'NOT_INTERESTED',
  ) {
    // Verify the opportunity belongs to the user
    const opportunity = await this.prisma.opportunityMatch.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!opportunity) {
      throw new Error('Opportunity not found');
    }
    
    // Update the status
    const updatedOpportunity = await this.prisma.opportunityMatch.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        targetUser: {
          select: {
            handle: true,
            disclosureLevel: true,
          },
        },
      },
    });
    
    // Check if this creates a mutual match
    if (status === 'INTERESTED') {
      // Find the corresponding opportunity from the target user
      const reciprocalOpportunity = await this.prisma.opportunityMatch.findFirst({
        where: {
          userId: opportunity.targetUserId,
          targetUserId: opportunity.userId,
          status: 'INTERESTED',
        },
      });
      
      if (reciprocalOpportunity) {
        // Update both opportunities to MUTUAL
        await this.prisma.opportunityMatch.updateMany({
          where: {
            OR: [
              { id: opportunity.id },
              { id: reciprocalOpportunity.id },
            ],
          },
          data: {
            status: 'MUTUAL',
            updatedAt: new Date(),
          },
        });
        
        // In a real implementation, this would trigger an introduction email
        
        // Return the updated opportunity with MUTUAL status
        return {
          ...updatedOpportunity,
          status: 'MUTUAL',
        };
      }
    }
    
    return updatedOpportunity;
  }

  async validatePassword(user: any, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async checkHandleAvailability(handle: string) {
    // Validate handle format
    const handleRegex = /^[a-zA-Z0-9_-]{3,50}$/;
    if (!handleRegex.test(handle)) {
      return {
        available: false,
        reason: 'Handle must be 3-50 characters and contain only letters, numbers, underscores, and hyphens',
      };
    }

    // Check if handle exists
    const existingUser = await this.prisma.user.findUnique({
      where: { handle },
    });

    return {
      available: !existingUser,
      handle,
    };
  }

  async updatePrivacySettings(userId: string, settings: {
    narrativeLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
    currentFocusLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
    seekingConnectionsLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
    offeringExpertiseLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
  }) {
    // Check if privacy settings exist
    const existing = await this.prisma.privacySettings.findUnique({
      where: { userId },
    });

    if (existing) {
      // Update existing privacy settings
      return this.prisma.privacySettings.update({
        where: { userId },
        data: {
          ...settings,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new privacy settings
      return this.prisma.privacySettings.create({
        data: {
          userId,
          ...settings,
        },
      });
    }
  }

  async updateOnboardingStage(userId: string, stage: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { onboardingStage: stage as any },
    });
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboardingStage: true,
        status: true,
        handle: true,
        profile: true,
        professionalEssence: true,
        privacySettings: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Determine the next step based on current stage and data
    let nextStep = '';
    switch (user.onboardingStage) {
      case 'HANDLE_SELECTION':
        nextStep = '/onboard/handle';
        break;
      case 'PRIVACY_SETUP':
        nextStep = '/onboard/privacy';
        break;
      case 'AGENT_NAMING':
        nextStep = '/onboard/agent';
        break;
      case 'PROFESSIONAL_ESSENCE':
        nextStep = '/onboard/personalize';
        break;
      case 'AWAITING_APPROVAL':
        nextStep = '/dashboard';
        break;
      case 'COMPLETED':
        nextStep = '/dashboard';
        break;
    }

    return {
      stage: user.onboardingStage,
      status: user.status,
      nextStep,
      isComplete: user.onboardingStage === 'COMPLETED',
    };
  }
}
