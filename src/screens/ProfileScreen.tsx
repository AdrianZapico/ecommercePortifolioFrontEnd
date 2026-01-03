import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice'; // Importamos para atualizar o Redux se mudar o nome
import type { RootState } from '../store';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(''); // Para erro de senha não conferir

    // Estado para armazenar os pedidos
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            // 1. Preenche o formulário com dados atuais
            setName(userInfo.name);
            setEmail(userInfo.email);

            // 2. Busca os pedidos do usuário
            const fetchMyOrders = async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    };
                    const { data } = await axios.get('/api/orders/myorders', config);
                    setOrders(data);
                    setLoadingOrders(false);
                } catch (err: any) {
                    setOrdersError(err.response?.data?.message || err.message);
                    setLoadingOrders(false);
                }
            };

            fetchMyOrders();
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('As senhas não conferem');
        } else {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                // Envia atualização pro Backend
                const res = await axios.put(
                    '/api/users/profile',
                    { name, email, password },
                    config
                );

                // Atualiza o Redux e LocalStorage com os novos dados
                dispatch(setCredentials({ ...res.data }));

                alert('Perfil atualizado com sucesso!');
                setMessage('');
            } catch (err: any) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="flex flex-col md:flex-row gap-10">

                {/* --- COLUNA 1: ATUALIZAR PERFIL --- */}
                <div className="md:w-1/4">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">Perfil de Usuário</h2>

                    {message && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{message}</div>}

                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Nome</label>
                            <input
                                type="text"
                                placeholder="Digite seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Senha</label>
                            <input
                                type="password"
                                placeholder="Digite nova senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Confirmar Senha</label>
                            <input
                                type="password"
                                placeholder="Confirme a senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            />
                        </div>

                        <button type="submit" className="bg-slate-900 text-white font-bold py-2 px-4 rounded hover:bg-slate-700 transition">
                            Atualizar
                        </button>
                    </form>
                </div>

                {/* --- COLUNA 2: MEUS PEDIDOS --- */}
                <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">Meus Pedidos</h2>

                    {loadingOrders ? (
                        <p>Carregando pedidos...</p>
                    ) : ordersError ? (
                        <div className="bg-red-100 text-red-700 p-3 rounded">{ordersError}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">ID</th>
                                        <th className="py-3 px-6 text-left">Data</th>
                                        <th className="py-3 px-6 text-left">Total</th>
                                        <th className="py-3 px-6 text-center">Pago</th>
                                        <th className="py-3 px-6 text-center">Entregue</th>
                                        <th className="py-3 px-6 text-center">Detalhes</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{order._id}</td>
                                            <td className="py-3 px-6 text-left">{order.createdAt.substring(0, 10)}</td>
                                            <td className="py-3 px-6 text-left">${order.totalPrice}</td>
                                            <td className="py-3 px-6 text-center">
                                                {order.isPaid ? (
                                                    <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">Sim</span>
                                                ) : (
                                                    <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs">Não</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {order.isDelivered ? (
                                                    <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">Sim</span>
                                                ) : (
                                                    <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs">Não</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <Link to={`/order/${order._id}`} className="bg-slate-200 text-slate-700 py-1 px-3 rounded hover:bg-slate-300 transition">
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
            </div>
        </div>
    );
};

export default ProfileScreen;