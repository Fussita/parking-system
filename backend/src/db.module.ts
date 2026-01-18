import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barrier } from './core/entity/barrier.entity';
import { Incident, IncidentMessage } from './core/entity/incident.entity';
import { Parking } from './core/entity/parking.entity';
import { Payment, Recharge } from './core/entity/payment.entity';
import { Tariff } from './core/entity/tariff.entity';
import { User, PaymentMethod } from './core/entity/user.entity';
import { Vehicle, VehicleEntry } from './core/entity/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        port: 5432,
        host: config.get<string>('DB_HOST'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // SOLO DESARROLLO
        // En produccion se usa synch: false
        // En produccion generas migrations:
        // npm run typeorm migration:generate -- -n InitSchema npm run typeorm migration:run
      }),
    }),
    TypeOrmModule.forFeature([
      Barrier,
      Incident,
      IncidentMessage,
      Parking,
      Payment,
      Recharge,
      Tariff,
      User,
      PaymentMethod,
      Vehicle,
      VehicleEntry
    ])
  ],
  exports: [
    TypeOrmModule
  ]
})
export class DatabaseModule {}
