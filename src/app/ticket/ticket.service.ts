import { InventoryMovement, Ticket, TicketItem } from '@common/entities';
import { IUserTokenInfo } from '@common/formats/user-token-info.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-tocket.dto';
import { generateTicketNumber } from './helper/ticket-number-generator.helper';
import { InventoryMovementType } from '@common/entities/inventory-movement.entity';
import { EInventoryMovementReason } from '@app/inventory/inventory-movements/enum/inventory-movement-reasons.enum';

interface ITicketHistory {
  id: string;
  institution: string;
  ticketNumber: string;
  product: string;
  quantity: number;
  createdAt: Date;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,

    @InjectRepository(TicketItem)
    private readonly ticketItemRepository: Repository<TicketItem>,
  ) {}

  async historyByBeneficiaryId(beneficiaryId: string): Promise<any> {
    const tickets = await this.ticketRepository.find({
      where: { beneficiaryId },
      relations: ['items', 'items.inventoryItem'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return tickets.reduce((acc: ITicketHistory[], ticket) => {
      const ticketItems = ticket.items.map((item) => {
        const { name, brand, presentation, dosage, form, unit } = item.inventoryItem.product;

        return {
          id: item.id + item.inventoryItemId,
          institution: ticket.institution.name,
          ticketNumber: ticket.ticketNumber,
          product: `${name} ${brand} ${dosage}/${unit} ${presentation} ${form}`,
          quantity: item.quantity,
          createdAt: ticket.createdAt,
        };
      });

      return [...acc, ...ticketItems];
    }, []);
  }

  async findByTicketNumber(ticketNumber: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticketNumber },
      relations: ['items', 'items.inventoryItem'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with number ${ticketNumber} not found`);
    }

    return ticket;
  }

  async create(
    createTicketDto: CreateTicketDto,
    institutionId: string,
    user: IUserTokenInfo,
  ): Promise<Ticket> {
    const today = new Date();
    const { beneficiaryId, inventoryItemId } = createTicketDto;
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    const countToday = await this.ticketRepository.count({
      where: {
        createdAt: Between(todayStart, todayEnd),
      },
    });

    const ticketNumber = generateTicketNumber(countToday);

    const itemCountMap = new Map<string, number>();
    for (const itemId of inventoryItemId) {
      itemCountMap.set(itemId, (itemCountMap.get(itemId) ?? 0) + 1);
    }

    const ticket = this.ticketRepository.create({
      ticketNumber,
      beneficiaryId,
      institutionId,
      userId: user.sub,
    });
    const savedTicket = await this.ticketRepository.save(ticket);

    const movements: InventoryMovement[] = [];
    const ticketItems: TicketItem[] = [];

    for (const [itemId, quantity] of itemCountMap.entries()) {
      movements.push(
        this.movementRepository.create({
          inventoryItemId: itemId,
          quantity,
          type: InventoryMovementType.OUT,
          reason: EInventoryMovementReason.BENEFICIARY_DELIVERY,
          ticketId: savedTicket.id,
          userId: user.sub,
        }),
      );

      ticketItems.push(
        this.ticketItemRepository.create({
          ticketId: savedTicket.id,
          inventoryItemId: itemId,
          quantity,
        }),
      );
    }

    await this.movementRepository.save(movements);
    await this.ticketItemRepository.save(ticketItems);
    return await this.findByTicketNumber(ticket.ticketNumber);
  }
}
