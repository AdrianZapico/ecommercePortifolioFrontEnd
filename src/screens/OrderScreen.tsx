import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Opcional: para notificações bonitas
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
    useGetOrderDetailsQuery,
    useDeliverOrderMutation
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
    const { id: orderId } = useParams();

    // 1. Hook para buscar dados (substitui useEffect e axios.get)
    const {
        data: order,
        refetch,
        isLoading,
        error
    } = useGetOrderDetailsQuery(orderId);

    // 2. Hook para entregar pedido (substitui axios.put)
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

    const { userInfo } = useSelector((state: any) => state.auth);

    const deliverHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch(); // Força a atualização dos dados na tela sem recarregar a página
            toast.success('Pedido marcado como entregue');
        } catch (err: any) {
            toast.error(err?.data?.message || err.message);
        }
    };

    // Renderização condicional baseada no status do Hook
    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>
            {(error as any)?.data?.message || 'Erro ao carregar pedido'}
        </Message>
    ) : (
        <div className="container mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Pedido: {order._id}</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* COLUNA ESQUERDA */}
                <div className="md:w-2/3">

                    {/* ENVIO */}
                    <div className="bg-white p-6 rounded shadow-sm mb-4 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Envio</h2>
                        <p className="mb-2">
                            <strong>Nome: </strong>
                            {order.user ? order.user.name : 'Usuário Deletado'}
                        </p>

                        <p className="mb-2">
                            <strong>Email: </strong>
                            {order.user ? (
                                <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">
                                    {order.user.email}
                                </a>
                            ) : (
                                'Email não disponível'
                            )}
                        </p>

                        <p className="mb-4">
                            <strong>Endereço: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>

                        {order.isDelivered ? (
                            <Message variant='success'>
                                Entregue em {order.deliveredAt.substring(0, 10)}
                            </Message>
                        ) : (
                            <Message variant='danger'>Não Entregue</Message>
                        )}
                    </div>

                    {/* PAGAMENTO */}
                    <div className="bg-white p-6 rounded shadow-sm mb-4 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Pagamento</h2>
                        <p className="mb-4">
                            <strong>Método: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant='success'>
                                Pago em {order.paidAt.substring(0, 10)}
                            </Message>
                        ) : (
                            <Message variant='danger'>Não Pago</Message>
                        )}
                    </div>

                    {/* ITENS */}
                    <div className="bg-white p-6 rounded shadow-sm mb-4 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Itens do Pedido</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Pedido vazio</Message>
                        ) : (
                            <ul>
                                {order.orderItems.map((item: any, index: number) => (
                                    <li key={index} className="flex items-center justify-between border-b py-2 last:border-0">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded mr-4"
                                            />
                                            <Link to={`/product/${item.product}`} className="text-slate-900 hover:underline font-medium">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-600">
                                            {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* COLUNA DIREITA: RESUMO */}
                <div className="md:w-1/3">
                    <div className="bg-white p-6 rounded shadow-lg border border-gray-200 sticky top-4">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Resumo</h2>

                        <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between">
                                <span>Itens</span>
                                <span>${order.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frete</span>
                                <span>${order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxa</span>
                                <span>${order.taxPrice}</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="flex justify-between font-bold text-lg text-slate-900">
                                <span>Total</span>
                                <span>${order.totalPrice}</span>
                            </div>
                        </div>

                        {/* Espaço reservado para botão PayPal */}
                        {!order.isPaid && (
                            <div className='mt-4 p-3 bg-yellow-50 text-yellow-800 text-center rounded border border-yellow-200'>
                                Botão do PayPal virá aqui
                            </div>
                        )}

                        {/* Botão de Marcar como Entregue (Apenas Admin) */}
                        {loadingDeliver && <Loader />}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded hover:bg-slate-700 transition duration-300 shadow-md"
                                    onClick={deliverHandler}
                                >
                                    Marcar como Entregue
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;