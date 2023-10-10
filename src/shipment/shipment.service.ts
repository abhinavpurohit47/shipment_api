import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CosmosClient,
  Container,
  Database,
  ItemDefinition,
} from '@azure/cosmos';
import { CreateShipment } from './createShipment.dto';
import { generateGuid } from 'src/utils/guid.util';
import { configDotenv } from 'dotenv';

configDotenv();
@Injectable()
export class ShipmentService {
  private readonly client: CosmosClient;
  private readonly database: Database;
  private readonly container: Container;

  constructor() {
    const endpoint = process.env.DB_ENDPOINT;
    const key = process.env.DB_KEY;
    const databaseID = process.env.DB_ID;
    const containerID = process.env.CONTAINER_ID;

    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(databaseID);
    this.container = this.database.container(containerID);
  }

  async getShipmentByGuid(guid: string) {
    if (!guid) {
      throw new NotFoundException('GUID not provided');
    }

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
        return resources[0];
      } else {
        throw new NotFoundException('Shipment Not Found');
      }
    } catch (error) {
      throw new NotFoundException('Shipment Not Found');
    }
  }

  async createShipment(shipment: CreateShipment) {
    const guid = generateGuid(); // Assuming you have a function to generate a GUID
    shipment.generated_guid = guid;

    try {
      const { resource } = await this.container.items.create(
        shipment as ItemDefinition,
      );
      return resource;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }
}
