import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipmentController } from './shipment/shipment.controller';
import { ShipmentModule } from './shipment/shipment.module';
import { ShipmentService } from './shipment/shipment.service';

@Module({
  imports: [ShipmentModule],
  controllers: [AppController, ShipmentController],
  providers: [AppService, ShipmentService],
})
export class AppModule {}
