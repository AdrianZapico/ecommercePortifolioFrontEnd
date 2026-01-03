import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../../store';

const ProductListScreen = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para controlar loading de ações
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const navigate = useNavigate();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [navigate, userInfo]);

    // --- 1. FUNÇÃO DELETAR ---
    const deleteHandler = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                setLoadingDelete(true);
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                await axios.delete(`/api/products/${id}`, config);

                setLoadingDelete(false);
                fetchProducts(); // Recarrega a lista
            } catch (err: any) {
                alert(err.response?.data?.message || err.message);
                setLoadingDelete(false);
            }
        }
    };

    // --- 2. FUNÇÃO CRIAR (O pulo do gato) ---
    const createProductHandler = async () => {
        if (window.confirm('Deseja criar um novo produto rascunho?')) {
            try {
                setLoadingCreate(true);
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };

                // Chama a rota que testamos no Postman
                const { data: createdProduct } = await axios.post('/api/products', {}, config);

                setLoadingCreate(false);
                // Redireciona IMEDIATAMENTE para a tela de edição
                navigate(`/admin/product/${createdProduct._id}/edit`);
            } catch (err: any) {
                alert(err.response?.data?.message || err.message);
                setLoadingCreate(false);
            }
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Produtos (Admin)</h1>
                <button
                    onClick={createProductHandler}
                    disabled={loadingCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700 transition flex items-center gap-2"
                >
                    {loadingCreate ? 'Criando...' : '+ Criar Produto'}
                </button>
            </div>

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
                                <th className="py-3 px-4 text-left">PREÇO</th>
                                <th className="py-3 px-4 text-left">CATEGORIA</th>
                                <th className="py-3 px-4 text-left">MARCA</th>
                                <th className="py-3 px-4 text-center">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {products.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{product._id}</td>
                                    <td className="py-3 px-4">{product.name}</td>
                                    <td className="py-3 px-4">${product.price}</td>
                                    <td className="py-3 px-4">{product.category}</td>
                                    <td className="py-3 px-4">{product.brand}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300 transition"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                disabled={loadingDelete}
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

export default ProductListScreen;