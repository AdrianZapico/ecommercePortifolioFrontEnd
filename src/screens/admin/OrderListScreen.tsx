import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../../store';

const OrderListScreen = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                // Chama a rota de Admin que lista TUDO
                const { data } = await axios.get('/api/orders', config);
                setOrders(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.isAdmin) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    return (
        <div className="container mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Pedidos (Admin)</h1>

            {loading ? (
                <p>Carregando pedidos...</p>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">USUÁRIO</th>
                                <th className="py-3 px-4 text-left">DATA</th>
                                <th className="py-3 px-4 text-left">TOTAL</th>
                                <th className="py-3 px-4 text-center">PAGO</th>
                                <th className="py-3 px-4 text-center">ENTREGUE</th>
                                <th className="py-3 px-4 text-center">DETALHES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-mono text-sm">{order._id}</td>
                                    <td className="py-3 px-4">
                                        {order.user && order.user.name ? order.user.name : 'Usuário Deletado'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className="py-3 px-4">${order.totalPrice}</td>

                                    {/* Status de Pagamento */}
                                    <td className="py-3 px-4 text-center">
                                        {order.isPaid ? (
                                            <span className="text-green-600 font-bold">
                                                {order.paidAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-bold">❌</span>
                                        )}
                                    </td>

                                    {/* Status de Entrega */}
                                    <td className="py-3 px-4 text-center">
                                        {order.isDelivered ? (
                                            <span className="text-green-600 font-bold">
                                                {order.deliveredAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-bold">❌</span>
                                        )}
                                    </td>

                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300 transition"
                                        >
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderListScreen;