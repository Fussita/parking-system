import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/core/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()       
        if ( !request.headers['authorization'] ) throw new UnauthorizedException() 
        const [type, token] = request.headers['authorization'].split(' ') ?? []
        if ( type != 'Bearer' || !token ) throw new UnauthorizedException()                       
        try {
            const payload = await this.jwtService.verifyAsync( token )
            const userData = await this.userRepo.findOne({ where: { id: payload.id } }) 
            if (!userData) throw new UnauthorizedException()
            request.user = userData
        } catch { throw new UnauthorizedException() }
        return true
    }

}