import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../store';

const OrderScreen = () => {
    const { id: orderId } = useParams(); // Pega o ID da URL

    // Estados locais para controlar o carregamento e os dados
    const [order, setOrder] = useState<any>(null); // Usando any por simplicidade agora
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };

                const { data } = await axios.get(`/api/orders/${orderId}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (userInfo && orderId) {
            fetchOrder();
        }
    }, [orderId, userInfo]);

    const deliverHandler = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            };
            await axios.put(`/api/orders/${order._id}/deliver`, {}, config);

            // Recarrega a tela para mostrar o novo status
            window.location.reload();
        } catch (err: any) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // Se estiver carregando
    if (loading) return <h2 className="text-center mt-10">Carregando pedido...</h2>;

    // Se der erro
    if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

    // Se carregou mas não tem pedido
    if (!order) return <div className="text-center mt-10">Pedido não encontrado</div>;

    return (
        <div className="container mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Pedido: {order._id}</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* COLUNA ESQUERDA */}
                <div className="md:w-2/3">

                    {/* ENVIO */}
                    <div className="bg-white p-6 rounded shadow-sm mb-4 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Envio</h2>
                        <p>
                            <strong>Nome: </strong>
                            {order.user ? order.user.name : 'Usuário Deletado'}
                        </p>

                        <p>
                            <strong>Email: </strong>
                            {order.user ? (
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            ) : (
                                'Email não disponível'
                            )}
                        </p><p className="mb-4">
                            <strong>Endereço: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
                                Entregue em {order.deliveredAt?.substring(0, 10)}
                            </div>
                        ) : (
                            <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
                                Não Entregue
                            </div>
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
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
                                Pago em {order.paidAt?.substring(0, 10)}
                            </div>
                        ) : (
                            <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
                                Não Pago
                            </div>
                        )}
                    </div>

                    {/* ITENS */}
                    <div className="bg-white p-6 rounded shadow-sm mb-4 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Itens do Pedido</h2>
                        <ul>
                            {order.orderItems.map((item: any, index: number) => (
                                <li key={index} className="flex items-center justify-between border-b py-2">
                                    <div className="flex items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded mr-4"
                                        />
                                        <Link to={`/product/${item.product}`} className="text-slate-900 hover:underline">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div className="text-gray-600">
                                        {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* COLUNA DIREITA: RESUMO */}
                <div className="md:w-1/3">
                    <div className="bg-white p-6 rounded shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Resumo do Pedido</h2>
                        <div className="flex justify-between mb-2">
                            <span>Itens</span>
                            <span>${order.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Frete</span>
                            <span>${order.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Taxa</span>
                            <span>${order.taxPrice}</span>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between mb-6 font-bold text-lg">
                            <span>Total</span>
                            <span>${order.totalPrice}</span>
                        </div>

                        {/* Aqui entraremos com o botão do PayPal no futuro */}
                        {!order.isPaid && (
                            <div className="bg-gray-100 p-3 rounded text-center text-sm text-gray-500">
                                Botão de Pagamento virá aqui
                            </div>
                        )}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded hover:bg-slate-700 transition"
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