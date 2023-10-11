import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Match } from './match.decorator';
export class CreateShipment {
  generated_guid: string;

  @IsNotEmpty()
  ship_id: string;

  @IsNotEmpty()
  ship_from_city: string;

  @IsNotEmpty()
  @Match('ship_to_city')
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
  @IsNumber()
  @Min(1)
  expected_no_of_days: number;

  @IsNotEmpty()
  ship_captain: string;

  ship_co_captain: string;
}
