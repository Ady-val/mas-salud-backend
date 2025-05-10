import { PermissionGuard } from '@app/auth/guard/permissions.guard';
import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { TicketsService } from './ticket.service';
import { CreateTicketDto } from './dto/create-tocket.dto';
import { UserRequest } from '@common/interfaces/api-request.interface';
import { ScopedInstitutionId } from '@common/decorators/scoped-institution-id.decorator';
import { Ticket } from '@common/entities';

@Controller('tickets')
@UseGuards(PermissionGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @ScopedInstitutionId() institutionId: string,
    @Request() req: UserRequest,
  ): Promise<Ticket> {
    return this.ticketsService.create(createTicketDto, institutionId, req.user);
  }

  @Get(':ticketNumber')
  async findByTicketNumber(@Param('ticketNumber') ticketNumber: string): Promise<Ticket> {
    return this.ticketsService.findByTicketNumber(ticketNumber);
  }

  @Get('history/:beneficiaryId')
  async historyByBeneficiaryId(@Param('beneficiaryId') beneficiaryId: string): Promise<any[]> {
    return this.ticketsService.historyByBeneficiaryId(beneficiaryId);
  }
}
