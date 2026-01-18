import * as bcrypt from 'bcrypt'

export class Encryptor {
    
    async hash(plane: string): Promise<string> {
        return bcrypt.hash(plane, 10)
    }
    
    async comparePlaneHash(plane: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plane, hash)
    }
}