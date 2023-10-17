import { IsNotEmpty, IsDateString } from 'class-validator';
import { Match } from './match.decorator';
import { IsDateRangeValid } from './date-range.validator';

export class UpdateShipment {
  generated_guid: string;

  @IsNotEmpty()
  ship_id: string;

  @IsNotEmpty()
  ship_from_city: string;

  @IsNotEmpty()
  @Match('ship_to_city')
  ship_to_city: string;

  @IsNotEmpty()
  @IsDateString()
  @IsDateRangeValid({
    message: 'ship_from_date cannot be greater than ship_to_date',
  })
  ship_from_date: Date;

  @IsNotEmpty()
  @IsDateString()
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
