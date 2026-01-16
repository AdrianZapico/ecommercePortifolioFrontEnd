import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
    useGetUsersQuery,
    useDeleteUserMutation
} from '../../slices/usersApiSlice';

const UserListScreen = () => {
    // 1. Busca os dados usando Redux (Automaticamente trata loading e erro)
    const { data: users, refetch, isLoading, error } = useGetUsersQuery({});

    // 2. Hook para deletar
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    const deleteHandler = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await deleteUser(id);
                refetch();
                toast.success('Usuário removido com sucesso');
            } catch (err: any) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    Gerenciamento de Usuários
                </h1>
            </div>

            {loadingDelete && <Loader />}

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
                </div>
            ) : error ? (
                <Message variant='danger'>
                    {(error as any)?.data?.message || 'Erro ao carregar usuários'}
                </Message>
            ) : (
                <div className="overflow-x-auto bg-white shadow-2xl rounded-xl border border-slate-100">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-800 text-white uppercase text-xs tracking-widest">
                                <th className="py-4 px-6 text-left font-semibold">ID</th>
                                <th className="py-4 px-6 text-left font-semibold">NOME</th>
                                <th className="py-4 px-6 text-left font-semibold">EMAIL</th>
                                <th className="py-4 px-6 text-center font-semibold">ADMIN</th>
                                <th className="py-4 px-6 text-center font-semibold">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600 divide-y divide-slate-100">
                            {users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs">{user._id}</td>
                                    <td className="py-4 px-6 font-medium text-slate-900">{user.name}</td>
                                    <td className="py-4 px-6">
                                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                                            {user.email}
                                        </a>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500 mx-auto" />
                                        ) : (
                                            <FaTimes className="text-red-400 mx-auto" />
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center gap-3">
                                            <Link
                                                to={`/admin/user/${user._id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <FaEdit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                disabled={loadingDelete}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-30"
                                                title="Excluir"
                                            >
                                                <FaTrash size={18} />
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