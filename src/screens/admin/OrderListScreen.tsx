import { Link } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
    // Busca todos os pedidos do sistema (Admin)
    const { data: orders, isLoading, error } = useGetOrdersQuery({});

    return (
        <div className="container mx-auto mt-10 px-4 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    Gerenciamento de Pedidos
                </h1>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
                </div>
            ) : error ? (
                <Message variant='danger'>
                    {(error as any)?.data?.message || 'Erro ao carregar pedidos'}
                </Message>
            ) : (
                <div className="overflow-x-auto bg-white shadow-2xl rounded-xl border border-slate-100">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-800 text-white uppercase text-xs tracking-widest">
                                <th className="py-4 px-6 text-left font-semibold">ID</th>
                                <th className="py-4 px-6 text-left font-semibold">USUÁRIO</th>
                                <th className="py-4 px-6 text-left font-semibold">DATA</th>
                                <th className="py-4 px-6 text-left font-semibold">TOTAL</th>
                                <th className="py-4 px-6 text-center font-semibold">PAGO</th>
                                <th className="py-4 px-6 text-center font-semibold">ENTREGUE</th>
                                <th className="py-4 px-6 text-center font-semibold">DETALHES</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600 divide-y divide-slate-100">
                            {orders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs">{order._id}</td>
                                    <td className="py-4 px-6 font-medium text-slate-900">
                                        {order.user && order.user.name ? order.user.name : 'Usuário Deletado'}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        {order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}
                                    </td>
                                    <td className="py-4 px-6 font-semibold">
                                        ${order.totalPrice}
                                    </td>

                                    {/* Status de Pagamento */}
                                    <td className="py-4 px-6 text-center">
                                        {order.isPaid ? (
                                            <div className="flex flex-col items-center">
                                                <FaCheck className="text-green-500 mb-1" />
                                                <span className="text-xs text-green-600 font-bold">{order.paidAt.substring(0, 10)}</span>
                                            </div>
                                        ) : (
                                            <FaTimes className="text-red-400 mx-auto" />
                                        )}
                                    </td>

                                    {/* Status de Entrega */}
                                    <td className="py-4 px-6 text-center">
                                        {order.isDelivered ? (
                                            <div className="flex flex-col items-center">
                                                <FaCheck className="text-green-500 mb-1" />
                                                <span className="text-xs text-green-600 font-bold">{order.deliveredAt.substring(0, 10)}</span>
                                            </div>
                                        ) : (
                                            <FaTimes className="text-red-400 mx-auto" />
                                        )}
                                    </td>

                                    {/* Botão de Detalhes */}
                                    <td className="py-4 px-6 text-center">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-colors"
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