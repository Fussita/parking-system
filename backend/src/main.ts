import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { SeedService } from './seeds/seed.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] })
  app.enableCors({
    origin: '*',
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true,       
  }))
  
  const seedService = app.get(SeedService) 
  await seedService.run()
  
  const config = new DocumentBuilder() 
  .setTitle('Ejemplo API') 
  .setDescription('Documentación de la API con Swagger') 
  .setVersion('1.0')
  .addBearerAuth( { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', }, 'access-token' )  
  .build()
  
  const document = SwaggerModule.createDocument(app, config) 
  SwaggerModule.setup('api', app, document)
  
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
