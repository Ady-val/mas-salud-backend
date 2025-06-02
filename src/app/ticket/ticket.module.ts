import { AuthModule } from '@app/auth/auth.module';
import { InventoryMovement, Ticket, TicketItem } from '@common/entities';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './ticket.controller';
import { TicketsService } from './ticket.service';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { CaslModule } from '@app/auth/casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketItem, InventoryMovement]),
    AuthModule,
    CaslModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(TicketsController);
  }
}
