import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class LoginInput {
  
  @ApiProperty({ example: 'juanpedro@gmail.com' })
  @IsString()
  @MinLength(4, { message: 'El Email de usuario debe tener al menos 3 caracteres'} )   
  email: string
  
  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(4, { message: 'La contraseña debe tener al menos 3 caracteres'} )   
  password: string

}

export class RegisterInput {
  
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MinLength(4, { message: 'El nombre debe tener al menos 3 caracteres'} )   
  name: string
  
  @ApiProperty({ example: 'juanpedro@gmail.com' })
  @IsString()
  @MinLength(4, { message: 'El email debe tener al menos 3 caracteres'} )   
  email: string
  
  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(4, { message: 'La contraseña debe tener al menos 3 caracteres'} )   
  password: string

  @ApiProperty({ enum: ['Administrador', 'Conductor'], example: 'Conductor' })
  @IsString()
  @MinLength(3, { message: 'El rol debe tener al menos 3 caracteres'} )   
  role: string

}
