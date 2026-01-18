import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { DatabaseModule } from './db.module';
import { UserController } from './user/controller/user.controller';
import { PaymentMethodService } from './user/service/payment-method.service';
import { ParkingController } from './vehicle/controller/parking.controller';
import { VehicleController } from './vehicle/controller/vehicle.controller';
import { RechargeService } from './user/service/recharge-service';
import { AuthService } from './auth/auth.service';
import { TariffController } from './tariff/controller/tariff.controller';
import { PaymentController } from './tariff/controller/payment.controller';
import { PaymentService } from './tariff/service/payment.service';
import { TariffService } from './tariff/service/tariff.service';
import { VehicleService } from './vehicle/service/vehicle.service';
import { ParkingService } from './vehicle/service/parking.service';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { IncidentGateway } from './incidents/incident.gateway';
import { IncidentController } from './incidents/controller/indicent.controller';
import { IncidentService } from './incidents/services/incident.services';
import { SeedService } from './seeds/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(), 
        JWT_EXPIRES_IN: Joi.string().default('48h'),
      }),
    }),
    AuthModule,
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '48h'
          },
        };
      },
    }),
  ],
  controllers: [
    UserController,
    ParkingController,
    VehicleController,
    TariffController,
    PaymentController,
    IncidentController
  ],
  providers: [
    PaymentMethodService,
    RechargeService,
    AuthService,
    PaymentService,
    TariffService,
    VehicleService,
    ParkingService,
    IncidentService,
    SeedService,
    IncidentGateway
  ],
})
export class AppModule {}
