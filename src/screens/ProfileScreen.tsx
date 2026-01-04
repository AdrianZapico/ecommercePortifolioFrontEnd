import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Importando Toast para alertas bonitos
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';
import type { RootState } from '../store';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    // --- NOVOS STATES PARA IMAGEM ---
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    // --------------------------------

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
            setName(userInfo.name);
            setEmail(userInfo.email);
            // Carrega a imagem atual do usuário (ou vazio se não tiver)
            setImage(userInfo.image || '');

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

    // --- FUNÇÃO DE UPLOAD DE IMAGEM ---
    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo?.token}`, // Necessário para rota de upload
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            setImage(data); // Define a URL da imagem retornada pelo backend
            setUploading(false);
            toast.success('Imagem carregada com sucesso!');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Erro no upload');
            setUploading(false);
        }
    };
    // ----------------------------------

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('As senhas não conferem');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            };

            // Agora enviamos também a 'image'
            const res = await axios.put(
                '/api/users/profile',
                { name, email, password, image },
                config
            );

            dispatch(setCredentials({ ...res.data }));

            toast.success('Perfil atualizado com sucesso!');
            setMessage('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="flex flex-col md:flex-row gap-10">

                {/* --- COLUNA 1: ATUALIZAR PERFIL --- */}
                <div className="md:w-1/4">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800">Perfil de Usuário</h2>

                    {message && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{message}</div>}

                    {/* --- PREVIEW DA FOTO (NOVO) --- */}
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 relative bg-gray-100">
                            <img
                                src={image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    {/* ----------------------------- */}

                    <form onSubmit={submitHandler}>

                        {/* --- INPUT DE UPLOAD (NOVO) --- */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Foto de Perfil</label>
                            {/* Input de texto oculto ou visível se quiser ver a URL */}
                            <input
                                type="text"
                                placeholder="URL da imagem"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-3 py-2 border rounded mb-2 text-xs bg-gray-50 text-gray-500"
                                readOnly
                            />
                            <input
                                type="file"
                                onChange={uploadFileHandler}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                            />
                            {uploading && <p className="text-sm text-blue-500 mt-1">Enviando imagem...</p>}
                        </div>
                        {/* ----------------------------- */}

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

                        <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2 px-4 rounded hover:bg-slate-700 transition">
                            Atualizar Dados
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
                        <div className="overflow-x-auto shadow-sm rounded-lg">
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
                                            <td className="py-3 px-6 text-left">R$ {order.totalPrice}</td>
                                            <td className="py-3 px-6 text-center">
                                                {order.isPaid ? (
                                                    <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-bold">Sim</span>
                                                ) : (
                                                    <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs font-bold">Não</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {order.isDelivered ? (
                                                    <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-bold">Sim</span>
                                                ) : (
                                                    <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs font-bold">Não</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <Link to={`/order/${order._id}`} className="bg-slate-200 text-slate-700 py-1 px-3 rounded hover:bg-slate-300 transition font-bold">
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