import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../../store';

const UserListScreen = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { userInfo } = useSelector((state: RootState) => state.auth);

    // Função para buscar usuários
    const fetchUsers = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Se não for admin, chuta para a página de login
        if (userInfo && userInfo.isAdmin) {
            fetchUsers();
        } else {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    // Função para deletar usuário
    const deleteHandler = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                await axios.delete(`/api/users/${id}`, config);
                // Recarrega a lista após deletar
                fetchUsers();
                alert('Usuário removido');
            } catch (err: any) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Usuários (Admin)</h1>

            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">NOME</th>
                                <th className="py-3 px-4 text-left">EMAIL</th>
                                <th className="py-3 px-4 text-center">ADMIN</th>
                                <th className="py-3 px-4 text-center">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {users.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{user._id}</td>
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4">
                                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                                            {user.email}
                                        </a>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {user.isAdmin ? (
                                            <span className="text-green-600 font-bold">✅</span>
                                        ) : (
                                            <span className="text-red-600 font-bold">❌</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/admin/user/${user._id}/edit`}
                                                className="bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300 transition"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                            >
                                                Excluir
                                            </button>
                                        </div>
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

export default UserListScreen;