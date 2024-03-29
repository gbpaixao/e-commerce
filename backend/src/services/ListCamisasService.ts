import database from '../database';

class ListCamisasService {
  async execute(id: number) {
    const camisas = await database
      .clone()
      .select(
        // 'idCamisa',
        'idCamisa as id',
        'nome as nomeCamisa',
        'descricao',
        'valor',
        'estoque',
        'tamanho',
        'tipo'
      )
      .from('Camisa')
      .where('idCamisa', id);

    return camisas[0];
  }
}

export { ListCamisasService };
