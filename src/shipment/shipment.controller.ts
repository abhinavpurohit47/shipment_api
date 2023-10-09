import {
  Controller,
  Body,
  Get,
  Post,
  Res,
  Param,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateShipment } from './createShipment.dto';
import { ShipmentService } from './shipment.service';
import { Response } from 'express';
import { generateGuid } from 'src/utils/guid.util';
import { CosmosClient } from '@azure/cosmos';
import { Database, Container, ItemDefinition } from '@azure/cosmos';
import * as dotenv from 'dotenv';

dotenv.config();
const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;

const databaseID = process.env.DB_ID;
const containerID = process.env.CONTAINER_ID;
console.log('Endpoint:', endpoint);
console.log('Key:', key);
console.log('DB_ID:', databaseID);
console.log('Container: ', containerID);

export const client = new CosmosClient({ endpoint, key });

@Controller('shipment')
export class ShipmentController {
  private readonly logger = new Logger(ShipmentController.name);
  private createdGuid: string;
  shipmentService: ShipmentService;
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  constructor(private readonly _shipmentService: ShipmentService) {
    this.shipmentService = _shipmentService;
    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(databaseID);
    this.container = this.database.container(containerID);
  }

  @Get('/:guid')
  async getShipment(@Param('guid') guid: string, @Res() res: Response) {
    if (!guid) {
      throw new NotFoundException('GUID not provided');
    }
    this.logger.log(`Received GUID: ${guid}`);
    try {
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.generated_guid = @guid',
        parameters: [
          {
            name: '@guid',
            value: guid,
          },
        ],
      };

      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      if (resources && resources.length > 0) {
        this.logger.log(`Successfully retrieved shipment with GUID: ${guid}`);
        return res.status(200).json(resources[0]);
      } else {
        this.logger.warn(
          `Shipment with GUID ${guid} not found in the database`,
        );
        throw new NotFoundException('Shipment Not Found');
      }
    } catch (error) {
      this.logger.error(`Error retrieving shipment: ${error}`);
      console.error('Error retrieving shipment: ', error);
      throw new NotFoundException('Shipment Not Found');
    }
  }

  @Post('/create')
  async createShipment(@Body() shipment: CreateShipment, @Res() res: any) {
    const guid = generateGuid();
    this.createdGuid = guid;
    shipment.generated_guid = guid;
    try {
      const { resource } = await this.container.items.create(
        shipment as ItemDefinition,
      );
      res.status(201).json({ guid });
      return resource;
    } catch (error) {
      console.log('Error creating shipment: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
