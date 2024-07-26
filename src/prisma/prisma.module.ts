import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // by addding this module will be available to all the modules without using imports in other modules
@Module({
  providers: [PrismaService],
  exports:[PrismaService]
})
export class PrismaModule {}
