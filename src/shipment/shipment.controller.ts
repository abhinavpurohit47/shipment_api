import {
  Controller,
  Body,
  Get,
  Post,
  Res,
  Param,
  Logger,
  Delete,
  Put,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { Response } from 'express';
import { CreateShipment } from './createShipment.dto';
import { UpdateShipment } from './updateShipment.dto';

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

  @Put('/:guid')
  async updateShipment(
    @Param('guid') guid: string,
    @Body() updateData: UpdateShipment,
    @Res() res: Response,
  ) {
    try {
      const updatedShipment = await this.shipmentService.updateShipmentByGuid(
        guid,
        updateData,
      );
      this.logger.log(`Successfully updated shipment with GUID: ${guid}`);
      return res.status(200).json(updatedShipment);
    } catch (error) {
      this.logger.log(`Error updating shipment: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  @Delete('/:guid')
  async deleteShipment(@Param('guid') guid: string, @Res() res: Response) {
    try {
      const deleted = await this.shipmentService.deleteShipmentByGuid(guid);

      if (deleted) {
        this.logger.log(`Successfully deleted shipment with GUID: ${guid}`);
        return res.status(200).json({ message: 'Shipment Deleted' });
      }
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
