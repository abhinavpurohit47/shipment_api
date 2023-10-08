import { IsNotEmpty } from 'class-validator';
export class GetShipment {
  @IsNotEmpty()
  guid: string;
}
