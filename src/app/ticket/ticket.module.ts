import { AuthModule } from '@app/auth/auth.module';
import { InventoryMovement, Ticket, TicketItem } from '@common/entities';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './ticket.controller';
import { TicketsService } from './ticket.service';
import { CaslAbilityFactory } from '@app/auth/casl/casl-ability.factory';
import { SessionMiddleware } from '@common/middlewares/session.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketItem, InventoryMovement]), AuthModule],
  controllers: [TicketsController],
  providers: [TicketsService, CaslAbilityFactory],
})
export class TicketModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(TicketsController);
  }
}
