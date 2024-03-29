import { Usuario } from '../@types/Usuario';
import database from '../database';
import { sign } from 'jsonwebtoken';

interface IAuthenticateRequest {
  email: string;
  password: string;
}

interface UsuarioEndereco extends Usuario {
  idUsuario: string;
  rua: string;
  bairro: string;
  numero: string;
  cep: string;
  complemento: string;
  cidade: string;
  estado: string;
  pais: string;
}

class AuthenticateService {
  async execute({ email, password }: IAuthenticateRequest) {
    const user = (
      await database
        .clone()
        .join('Cliente', 'Cliente.Usuario_idUsuario', 'Usuario.idUsuario')
        .join('Endereco', 'Endereco.idEndereco', 'Cliente.Endereco_idEndereco')
        .select<UsuarioEndereco[]>(
          'idUsuario',
          'cpf',
          'nome',
          'senha',
          'sobrenome',
          'telefone',
          'email',
          'rua',
          'bairro',
          'numero',
          'cep',
          'complemento',
          'cidade',
          'estado',
          'pais'
        )
        .from('Usuario')
        .where({ email })
    )[0];

    const adminDB = await database
      .clone()
      .join(
        'Administrador',
        'Administrador.Usuario_idUsuario',
        'Usuario.idUsuario'
      )
      .select()
      .from('Usuario')
      .where({ email });

    const isAdmin = adminDB.length !== 0 ? true : false;

    if (!user) {
      console.log('merda');
      throw new Error('Invalid email/password');
    }

    const passwordMatch = password === user.senha;

    if (!passwordMatch) {
      console.log('2merda');
      throw new Error('Invalid email/password');
    }

    const token = sign({}, '06de5b4fe24b14d67b1a53a7d5f4f7cb', {
      subject: String(user.idUsuario),
      expiresIn: '1d',
    });

    return {
      token,
      user: {
        idUsuario: user.idUsuario,
        email: user.email,
        cpf: user.cpf,
        nome: user.nome,
        sobrenome: user.sobrenome,
        telefone: user.telefone,
        rua: user.rua,
        bairro: user.bairro,
        numero: user.numero,
        cep: user.cep,
        complemento: user.complemento,
        cidade: user.cidade,
        estado: user.estado,
        pais: user.pais,
        admin: isAdmin,
      },
    };
  }
}

export { AuthenticateService };
