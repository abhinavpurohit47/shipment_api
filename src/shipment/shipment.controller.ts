import {
  Controller,
  Body,
  Get,
  Post,
  Res,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateShipment } from './createShipment.dto';
import { ShipmentService } from './shipment.service';
import { Response } from 'express';

@Controller('shipment')
export class ShipmentController {
  shipmentService: ShipmentService;
  constructor(private readonly _shipmentService: ShipmentService) {
    this.shipmentService = _shipmentService;
  }

  @Get('/:guid')
  getShipment(@Param('guid') guid: string, @Res() res: Response) {
    if (!guid) {
      throw new NotFoundException('GUID not provided');
    }
    const shipment = this.shipmentService.getShipment(guid);
    if (!shipment) {
      throw new NotFoundException('Shipment Not Found');
    }
    res.status(200).json(shipment);
  }
  @Post('/create')
  createShipment(@Body() shipment: CreateShipment, @Res() res: any) {
    const guid = this.shipmentService.createShipment(shipment);
    res.status(201).json({ guid });
  }
}
