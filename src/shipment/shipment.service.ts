/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateShipment } from './createShipment.dto';
export class ShipmentService {
  getShipment(guid: string): Promise<CreateShipment> {
    return null;
  }

  createShipment(shipment: CreateShipment): Promise<string> {
    return null;
  }
}
