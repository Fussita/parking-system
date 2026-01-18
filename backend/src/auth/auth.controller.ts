import { Body, Controller, Get, Logger, Post, UseGuards } from "@nestjs/common";
import { LoginInput, RegisterInput } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./guards/jwt-guard";
import { RolesGuard } from "./guards/role-guard";
import { Roles } from "./guards/roles-decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
    
    constructor(
        private readonly auth: AuthService
    ) {}

    private logger = new Logger('AuthController')

    @Post('login')
    async logInUser( @Body() entry: LoginInput ) {
        this.logger.debug(`Registro iniciado: ${JSON.stringify({ email: entry.email })}`);
        try {
            let r = await this.auth.logInUser(entry)
            this.logger.log({ action: 'Login', status: '201 Creado', email: entry.email })
            return r
        } catch (e) {
            this.logger.error({ action: 'Login', error: e.message, stack: e.stack, email: entry.email });
            throw e
        }
    }

    @Post('register')
    async signUpUser( @Body() entry: RegisterInput ) {
        this.logger.debug(`Registro iniciado: ${JSON.stringify({ email: entry.email })}`);
        try {
            await this.auth.signUpUser(entry)
            this.logger.log({ action: 'Registro', status: '201 Creado', email: entry.email })
        } catch (e) {
            this.logger.error({ action: 'Registro', error: e.message, stack: e.stack, email: entry.email });
            throw e
        }    
    }

    @Get('a')
    @Roles('Administrador')
    @UseGuards( JwtGuard, RolesGuard ) 
    @ApiBearerAuth('access-token')
    async authAdmin() {
        this.logger.log('[Get] Admin Autenticado')
    }

    @Get('c')
    @Roles('Conductor') 
    @UseGuards( JwtGuard, RolesGuard )
    @ApiBearerAuth('access-token')
    async authDriver() {
        this.logger.log('[Get] Conductor Autenticado')
    }

}