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
// import { calculateExpectedDays } from 'src/utils/days.util';
import { UpdateShipment } from './updateShipment.dto';

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

  async deleteShipmentByGuid(guid: string) {
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
      const queryIterator = this.container.items.query(querySpec);

      if (queryIterator.hasMoreResults()) {
        const { resources } = await queryIterator.fetchNext();
        console.log(resources[0].generated_guid);
        if (resources && resources.length > 0) {
          const response = await this.container.item(resources[0].id).delete();

          if (response.statusCode === 204) {
            return true;
          } else {
            return false;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Internal Server Error: ', error);
      return false;
    }
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
  async updateShipmentByGuid(guid: string, updateData: UpdateShipment) {
    try {
      const existingShipment = await this.getShipmentByGuid(guid);
      const updatedShipment = {
        ...existingShipment,
        ...updateData,
      };
      const response = await this.container
        .item(updatedShipment.id)
        .replace(updatedShipment);

      if (response.statusCode === 200) {
        return updatedShipment;
      } else {
        throw new Error('Failed to update Shipment');
      }
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }
  async createShipment(shipment: CreateShipment) {
    const guid = generateGuid();
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
