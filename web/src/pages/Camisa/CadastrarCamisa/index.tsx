import { useState } from 'react';
import {
  Form, InputGroup, Figure, Button, Spinner,
} from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';
import ButtonGroup from '../../../components/ButtonGroup';
import { Layout } from '../../../components/Layout';
import { ICamisa } from '../../../types/Camisa';
import { styles } from './styles';
import { getRandomTshirt } from '../../../server/getRandomTshirt';
import ItemsAmount from '../../../components/ItemsAmount';
import api from '../../../services/api';

export default function CadastroCamisa(): JSX.Element {
  bsCustomFileInput.init();
  /* Initial State */
  const [camisa, setCamisa] = useState<ICamisa>({
    nomeCamisa: '',
    descricao: '',
    valor: 0.00,
    tamanho: '',
    estoque: 0,
    quantidade: 1,
    numeroJogador: '',
    nomeJogador: '',
    pictures: [],
    mainPicture: '',
    fornecedor: '',
    tipo: '',
  } as ICamisa);

  const [quantidade, setQuantidade] = useState<number>(1);

  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  return (
    <Layout>
      <Form>
        <div className={styles.mainContainer}>
          <h1>Cadastro de Camisa</h1>

          <div className={styles.contentContainer}>
            <div className={styles.formContainer}>
              <Form.Group controlId="nome">
                <Form.Control
                  aria-label="nome"
                  value={camisa.nomeCamisa}
                  onChange={(event) => setCamisa({ ...camisa, nomeCamisa: event.target.value })}
                  placeholder="Nome"
                />
              </Form.Group>

              <Form.Group controlId="descricao">
                <Form.Control
                  aria-label="descricao"
                  value={camisa.descricao}
                  onChange={(event) => setCamisa({ ...camisa, descricao: event.target.value })}
                  placeholder="Descrição"
                />
              </Form.Group>

              <Form.Group controlId="fornecedor">
                <Form.Control
                  aria-label="fornecedor"
                  value={camisa.fornecedor}
                  onChange={(event) => setCamisa({ ...camisa, fornecedor: event.target.value })}
                  placeholder="Fornecedor"
                />
              </Form.Group>

              <Form.Group controlId="valor">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>R$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    aria-label="valor"
                    value={camisa.valor}
                    onChange={(event) => {
                      if (event.target.value) {
                        setCamisa({ ...camisa, valor: parseFloat(event.target.value) });
                      } else {
                        setCamisa({ ...camisa, valor: 0.00 });
                      }
                    }}
                    placeholder="Valor"
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="tipo">
                <Form.Label><b>Tipo</b></Form.Label>
                <ButtonGroup
                  array={['F', 'M']}
                  callback={(tipo) => setCamisa({ ...camisa, tipo })}
                />
              </Form.Group>

              <Form.Group controlId="quantidade">
                <Form.Label><b>Quantidade</b></Form.Label>
                <ItemsAmount
                  counter={quantidade}
                  setCounter={
                (qtde) => {
                  setQuantidade(qtde);
                  setCamisa({ ...camisa, quantidade: qtde });
                }
            }
                />
              </Form.Group>

              <Form.Group controlId="tamanho">
                <Form.Label><b>Tamanho</b></Form.Label>
                <ButtonGroup
                  array={['P', 'M', 'G']}
                  callback={(tamanho) => setCamisa({ ...camisa, tamanho })}
                />
              </Form.Group>

            </div>

            <div>
              <Form.Group controlId="pictures">
                <Form.File
                  id="custom-file"
                  label="Escolher uma imagem"
                  onChange={(e:any) => console.log(e.target.value)}
                  custom
                />
              </Form.Group>
              <div className={styles.picturesContainer}>
                <div className={styles.picturesContainerTop}>
                  <Figure>
                    <Figure.Image
                      src={getRandomTshirt()}
                    />
                    <Figure.Caption>
                      Thumbnail.png
                    </Figure.Caption>
                  </Figure>
                </div>
                <div className={styles.picturesContainerBottom}>
                  <Figure>
                    <Figure.Image
                      src={getRandomTshirt()}
                    />
                    <Figure.Caption>
                      Thumbnail.png
                    </Figure.Caption>
                  </Figure>
                  <Figure>
                    <Figure.Image
                      src={getRandomTshirt()}
                    />
                    <Figure.Caption>
                      Thumbnail.png
                    </Figure.Caption>
                  </Figure>
                </div>
              </div>

              <div className={styles.submitButton}>
                <Button
                  type="submit"
                  onClick={async (e) => {
                    setSubmitting(true);
                    try {
                      const response = await api.post('/camisas', {
                        camisa,
                      });

                      /* Adicionar à contextAPI */
                    } catch (error) {
                      toast.error('Houve algum problema!');
                    }
                    setSubmitting(false);
                    e.preventDefault();
                  }}
                  style={{ backgroundColor: '#5227CC', borderColor: '#5227CC', width: '150px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        {'  Cadastrando...'}
                      </div>
                    )
                    : 'Cadastrar Camisa'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Layout>
  );
}