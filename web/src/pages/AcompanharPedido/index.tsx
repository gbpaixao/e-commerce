/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Col, Image, Button,
} from 'react-bootstrap';
import { ImHome } from 'react-icons/im';
import { RiStore3Fill } from 'react-icons/ri';
import { MdLocalShipping } from 'react-icons/md';

import bsCustomFileInput from 'bs-custom-file-input';
import { useHistory, useParams } from 'react-router-dom';
import { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Layout } from '../../components/Layout';
import ItemsAmount from '../../components/ItemsAmount';
import { useCarrinho } from '../../contexts/CarrinhoContext';

import { formatCurrency } from '../../utils/utils';
import { getRandomTshirt } from '../../server/getRandomTshirt';
import { styles } from './styles';
import { Pedido } from '../../types/PedidoMetadados';
import { usePedido } from '../../contexts/PedidoContext';
import api from '../../services/api';
import { useUsuario } from '../../contexts/UsuarioContext';

function MudaCinzaLoja(
  values: string,
) {
  if (values === 'loja') {
    return styles.radioDiv2;
  }
  return styles.radioDiv;
}
function MudaCinzaCorreios(
  values: string,
) {
  if (values === 'correios') {
    return styles.radioDiv2;
  }
  return styles.radioDiv;
}
function MudaCinzaEntregue(
  values: string,
) {
  if (values === 'entregue') {
    return styles.radioDiv2;
  }
  return styles.radioDiv;
}
function IconLoja(
  values: string,
) {
  if (values === 'loja') {
    return 'white';
  }
  return 'rgba(73, 80, 87, 1)';
}

function IconCorreios(
  values: string,
) {
  if (values === 'correios') {
    return 'white';
  }
  return 'rgba(73, 80, 87, 1)';
}

function IconEntregue(
  values: string,
) {
  if (values === 'entregue') {
    return 'white';
  }
  return 'rgba(73, 80, 87, 1)';
}

export function AcompanharPedido(): JSX.Element {
  bsCustomFileInput.init();

  const { pedido, setPedido } = usePedido();

  const history = useHistory();

  const { usuario } = useUsuario();
  const clienteId = usuario.idUsuario;
  const { pedidoId } = useParams<{pedidoId?: string}>();
  console.log('pedidoId', pedidoId);
  // const pedidoId = 15;

  const formatData = (data: string) => {
    if (!data) return '';

    const dataOriginal = new Date(data);
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(dataOriginal);
  };

  useEffect(() => {
    async function getPedido() {
      const response = await api.get(`/pedidos/${1}/${pedidoId}`);
      console.log('response', response);
      setPedido(response.data);
    }
    getPedido();
  }, []);

  const handleCancelar = async () => {
    const response = await api.delete(`/pedidos/${clienteId}/${pedidoId}`);
  };

  return (
    <Layout>

      <div>
        <div className={styles.divCancel}>
          <Image
            src={getRandomTshirt()}
            height={140}
            width={104}
            thumbnail
            style={{ marginLeft: '50px', marginTop: '0.5rem', marginBottom: '0.5rem' }}
          />
          <Col>
            <p>N°</p>
            <b>{pedido.idPedido}</b>

          </Col>
          <Col style={{ minWidth: '12rem' }}>
            <p>Previsão de entrega</p>
            <b>
              {formatData(pedido.previsaoEntrega)}
            </b>
          </Col>
          <Col style={{ minWidth: '8rem' }}>
            <p>Total</p>
            <b>
              R$
              {'\n'}
              {pedido.valor}
            </b>
          </Col>
          <Col style={{
            minWidth: '10rem',
            marginRight: '20px',
            marginLeft: '2rem',
          }}
          >
            <Button
              variant="light"
              size="sm"
              onClick={handleCancelar}
            >
              Cancelar pedido
            </Button>
          </Col>
        </div>

        <div className={styles.divRadios}>

          <div>
            <div className={MudaCinzaLoja(pedido.status)}>
              <RiStore3Fill color={IconLoja(pedido.status)} size={30} />
            </div>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <p> Loja </p>
            </div>
          </div>

          <hr style={{
            minWidth: '33%',
          }}
          />

          <div>
            <div className={MudaCinzaCorreios(pedido.status)}>
              <MdLocalShipping color={IconCorreios(pedido.status)} size={30} />
            </div>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <p> Correios </p>
            </div>
          </div>

          <hr style={{
            minWidth: '33%',
          }}
          />

          <div>
            <div className={MudaCinzaEntregue(pedido.status)}>
              <ImHome color={IconEntregue(pedido.status)} size={30} />
            </div>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <p> Entregue </p>
            </div>
          </div>
        </div>

        <div
          className={styles.divLast}
        >

          <div
            style={{
              alignItems: 'center',
              justifyContent: 'space-evenly',
              display: 'flex',
            }}
          >
            <div
              style={{
                marginLeft: '0rem',
                width: '8rem',
              }}
            >
              {pedido.status === 'loja' && (
              <p>
                  {formatData(pedido.dataCompra)}
                  {'\n'}
                23:59

              </p>
              )}
              {pedido.status === 'correios'
              && (
              <p>
                  {formatData(pedido.dataCompra)}
                  {'\n'}
                23:59
                {' '}
                <br />
                29/07/2021 22:50
              </p>
              )}
              {pedido.status === 'entregue'
               && (
               <p>
                 {formatData(pedido.dataCompra)}
                 {'\n'}
                 23:59
                 {' '}
                 <br />
                 29/07/2021 22:50

                 <br />
                 30/08/2021 15:32
               </p>
               )}

            </div>

            <div style={{
              height: '200px',
              borderRight: '1px solid rgba(222, 226, 230, 1) ',
            }}
            />

            <div
              style={{
                marginLeft: '5px',
                width: '15rem',
              }}
            >
              {pedido.status === 'loja' && <p>compra aprovada</p>}
              {pedido.status === 'correios'
              && (
              <p>
                compra aprovada
                {' '}
                <br />
                pedido com os correios
              </p>
              )}
              {pedido.status === 'entregue'
              && (
              <p>
                compra aprovada
                {' '}
                <br />
                pedido nos correios
                <br />
                pedido entregue
              </p>
              )}
            </div>

          </div>

          <div
            style={{
              background: 'rgba(222, 226, 230, 1)',
              width: '20rem',
              borderRadius: '10px',
            }}
          >
            <div
              style={{
                marginLeft: '1rem',
                marginTop: '1rem',
              }}
            >
              <h5> Código de rastreio</h5>
              <p>{pedido.codigoRastreio}</p>
            </div>

            <div
              style={{
                marginLeft: '1rem',
                marginTop: '1rem',
              }}
            >
              <h5> Data de compra </h5>
              <p>
                {formatData(pedido.dataCompra)}
              </p>
            </div>

            <div
              style={{
                marginLeft: '1rem',
                marginTop: '1rem',
              }}
            >
              <h5> Previsão de entrega </h5>
              <p>
                {formatData(pedido.previsaoEntrega)}

              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>

  );
}
function setSubmitting(arg0: boolean) {
  throw new Error('Function not implemented.');
}
