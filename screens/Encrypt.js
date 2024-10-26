import { hash, compare, genSalt } from 'bcryptjs';

export const encriptarSenha = async(senha) => {
    try{
        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(senha, salt);
        return hashedPassword;
    }catch(err){

    }
   
    
}