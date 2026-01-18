import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginInput, RegisterInput } from "./dto/auth.dto";
import { Encryptor } from "src/core/utils/encryptor";
import { User } from "src/core/entity/user.entity";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    private encryptor = new Encryptor()

    async findById(id: string) {
        return await this.userRepo.findOneBy({ id: id })
    }

    async logInUser( entry: LoginInput ) {
        const account = await this.userRepo.findOne( { where: { email: entry.email } } )  
        if (!account) throw new BadRequestException('Usuario o contraseña no válido') 
        let compared = await this.encryptor.comparePlaneHash(entry.password, account.password)
        if (!compared) throw new BadRequestException('Usuario o contraseña no válido')
        const token = this.jwtService.sign( { id: account.id } )
        return { token: token }
    }

    async signUpUser( entry: RegisterInput ) {
        const find = await this.userRepo.findOne( { where: [ { email: entry.email } ] } )
        if (find) throw new BadRequestException('Email ya registrado')
        if (entry.role != 'Administrador' && entry.role != 'Conductor' ) throw new BadRequestException('Rol no Valido')
        let password = await this.encryptor.hash(entry.password)
        const result = this.userRepo.create({
            name: entry.name,
            password: password,
            role: entry.role,
            email: entry.email,
            accountBalance: 0
        })
        await this.userRepo.save(result)
    }
}