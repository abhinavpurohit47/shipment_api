import {
  Controller,
  Body,
  Get,
  Post,
  Res,
  Param,
  Logger,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { Response } from 'express';
import { CreateShipment } from './createShipment.dto';

@Controller('shipment')
export class ShipmentController {
  private readonly logger = new Logger(ShipmentController.name);

  constructor(private readonly shipmentService: ShipmentService) {}

  @Get('/:guid')
  async getShipment(@Param('guid') guid: string, @Res() res: Response) {
    try {
      const shipment = await this.shipmentService.getShipmentByGuid(guid);

      this.logger.log(`Successfully retrieved shipment with GUID: ${guid}`);
      return res.status(200).json(shipment);
    } catch (error) {
      this.logger.error(`Error retrieving shipment: ${error.message}`);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  @Post('/create')
  async createShipment(@Body() shipment: CreateShipment, @Res() res: any) {
    try {
      const createdShipment =
        await this.shipmentService.createShipment(shipment);
      this.logger.log(
        `Successfully Posted the shipment Details with GUID as: ${createdShipment.generated_guid}`,
      );
      res.status(201).json({ guid: createdShipment.generated_guid });
    } catch (error) {
      this.logger.error(`Error creating shipment: ${error.message}`);
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}
