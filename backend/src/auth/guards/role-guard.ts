import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../auth.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>( 'roles', context.getHandler(), )
    if (!requiredRoles) return true 
    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) throw new UnauthorizedException('Usuario no autenticado')
    const dbUser = await this.authService.findById(user.id)
    if (!dbUser) throw new UnauthorizedException('Usuario no registrado en la base de datos')
    const hasRole = requiredRoles.some((role) => dbUser.role === role)
    if (!hasRole) throw new ForbiddenException('No tienes permisos para acceder a este recurso')
    return true
  }
}
