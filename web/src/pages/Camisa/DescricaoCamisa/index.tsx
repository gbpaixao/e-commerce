/* eslint-disable global-require */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button, Form, Image, InputGroup,
} from 'react-bootstrap';
import api from '../../../services/api';
import { Layout } from '../../../components/Layout';
import './styles.css';
import ItemsAmount from '../../../components/ItemsAmount';
import { ICamisa } from '../../../types/Camisa';
import { IParams } from '../../../types/Params';

export default function DescricaoCamisa():JSX.Element {
  /* Initial State */
  const [camisa, setCamisa] = useState<ICamisa>({
    nomeCamisa: '',
    descricao: '',
    valor: 0,
    tamanho: '',
    estoque: 0,
    quantidade: 1,
    numeroJogador: '',
    nomeJogador: '',
    pictures: [],
    mainPicture: '',
  } as ICamisa);

  /* Fetch from server */
  const { id: idCamisa } = useParams<IParams>();
  useEffect(() => {
    api.get(`/camisa/${idCamisa}`).then((res) => setCamisa({ ...res.data[0] }));
  }, [idCamisa]);

  /* Quantidade */
  const [quantidadeCamisas, setQuantidadeCamisas] = useState<number>(1);
  const handleQuantidade = (childData: number) => {
    setQuantidadeCamisas(childData);
    setCamisa({ ...camisa, quantidade: childData });
  };

  return (
    <Layout>
      <Form>
        <div id="main-container">
          <div id="pictures-container">
            <div id="pictures-container-thumbnails">
              {camisa.pictures.map((picture, index) => (
                <Image
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  src={picture}
                  width={75}
                  height={95}
                />
              ))}
            </div>
            <div id="pictures-container-main">

              <Image
                src={camisa.mainPicture}
                width={300}
                height={440}
              />
            </div>
          </div>

          <div id="description-container">
            <h1>{camisa.nomeCamisa}</h1>

            <p>{camisa.descricao}</p>

            <Form.Group controlId="tamanho-camisa">
              <Form.Label><b>Tamanho</b></Form.Label>
              <br />
              <Button
                style={{
                  backgroundColor: '#5227CC',
                  borderColor: '#5227CC',
                  boxShadow: 'none',
                  width: '70px',
                  cursor: 'default',
                }}
              >
                {camisa.tamanho}
              </Button>

            </Form.Group>

            <div id="description-container-input-group">
              <Form.Group controlId="nome-jogador" style={{ width: '200px' }}>
                <Form.Label>
                  <b>Nome Jogador</b>
                </Form.Label>
                <Form.Control
                  aria-label="nome-jogador"
                  value={camisa.nomeJogador}
                  onChange={
                    (event) => setCamisa({ ...camisa, nomeJogador: event.target.value })
                  }
                  maxLength={12}
                />
                <Form.Text><small>Máximo de 12 caracteres</small></Form.Text>
              </Form.Group>

              <Form.Group controlId="numero-jogador" style={{ width: '126px' }}>
                <Form.Label><b>Nº do Jogador</b></Form.Label>
                <Form.Control
                  aria-label="numero-jogador"
                  value={camisa.numeroJogador}
                  onChange={
                    (event) => setCamisa({ ...camisa, numeroJogador: event.target.value })
                  }
                  maxLength={2}
                />
                <Form.Text><small>Máximo de 2 caracteres</small></Form.Text>
              </Form.Group>
            </div>

          </div>

          <div id="shipping-container">
            <div>
              <h1>{`R$ ${camisa.valor.toFixed(2).replace('.', ',')}`}</h1>
              <small>{`6x de R$ ${(camisa.valor / 6).toFixed(2).replace('.', ',')}`}</small>
            </div>

            <div>
              <Form.Group controlId="quantidade-camisa">
                <Form.Label>Quantidade</Form.Label>
                <ItemsAmount
                  counter={quantidadeCamisas}
                  setCounter={handleQuantidade}
                  estoque={camisa.estoque}
                />
                <Form.Text>
                  <small>
                    {`${camisa.estoque} unidades restantes`}
                  </small>
                </Form.Text>
              </Form.Group>
            </div>

            <div>
              <Form.Group controlId="frete">
                <Form.Label>Calcular Frete</Form.Label>
                <InputGroup>
                  <Form.Control aria-label="frete" placeholder="1" />
                  <InputGroup.Append>
                    <Button variant="outline-secondary">Ok</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </div>

            <div id="add-to-cart">
              <Button style={{ backgroundColor: '#5227CC', borderColor: '#5227CC' }}>
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        </div>

      </Form>
    </Layout>
  );
}
