import { IsNotEmpty } from 'class-validator';
export class CreateShipment {
  @IsNotEmpty()
  ship_id: string;
  @IsNotEmpty()
  ship_from_city: string;
  @IsNotEmpty()
  ship_to_city: string;
  @IsNotEmpty()
  ship_from_date: Date;
  @IsNotEmpty()
  ship_to_date: Date;
  @IsNotEmpty()
  weight_of_ship: number;
  @IsNotEmpty()
  weight_unit: string;
  @IsNotEmpty()
  expected_no_of_days: number;
  @IsNotEmpty()
  ship_captain: string;
  ship_co_captain: string;
}
