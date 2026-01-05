import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Ícones para um visual mais pro
import type { RootState } from '../../store';

const ProductListScreen = () => {
    // 1. Pegamos o número da página da URL (ex: /admin/productlist/page/2)
    const { pageNumber = 1 } = useParams();

    const [products, setProducts] = useState<any[]>([]);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const navigate = useNavigate();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // 2. Passamos o pageNumber na query string
            const { data } = await axios.get(`/api/products?pageNumber=${pageNumber}`);

            // 3. AQUI ESTÁ A CORREÇÃO: data agora tem products, page e pages
            setProducts(data.products);
            setPages(data.pages);
            setPage(data.page);

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
    }, [navigate, userInfo, pageNumber]); // Recarrega se a página mudar

    const deleteHandler = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                setLoadingDelete(true);
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                await axios.delete(`/api/products/${id}`, config);
                setLoadingDelete(false);
                fetchProducts();
            } catch (err: any) {
                alert(err.response?.data?.message || err.message);
                setLoadingDelete(false);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Deseja criar um novo produto rascunho?')) {
            try {
                setLoadingCreate(true);
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                const { data: createdProduct } = await axios.post('/api/products', {}, config);
                setLoadingCreate(false);
                navigate(`/admin/product/${createdProduct._id}/edit`);
            } catch (err: any) {
                alert(err.response?.data?.message || err.message);
                setLoadingCreate(false);
            }
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    Gerenciamento de Produtos
                </h1>
                <button
                    onClick={createProductHandler}
                    disabled={loadingCreate}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                >
                    <FaPlus /> {loadingCreate ? 'Criando...' : 'Novo Produto'}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">{error}</div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white shadow-2xl rounded-xl border border-slate-100">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-slate-800 text-white uppercase text-xs tracking-widest">
                                    <th className="py-4 px-6 text-left font-semibold">ID</th>
                                    <th className="py-4 px-6 text-left font-semibold">NOME</th>
                                    <th className="py-4 px-6 text-left font-semibold">PREÇO</th>
                                    <th className="py-4 px-6 text-left font-semibold">CATEGORIA</th>
                                    <th className="py-4 px-6 text-left font-semibold">MARCA</th>
                                    <th className="py-4 px-6 text-center font-semibold">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 divide-y divide-slate-100">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6 font-mono text-xs">{product._id}</td>
                                        <td className="py-4 px-6 font-medium text-slate-900">{product.name}</td>
                                        <td className="py-4 px-6 font-semibold">R$ {product.price.toFixed(2)}</td>
                                        <td className="py-4 px-6">
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs uppercase font-bold">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">{product.brand}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center gap-3">
                                                <Link
                                                    to={`/admin/product/${product._id}/edit`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Editar"
                                                >
                                                    <FaEdit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteHandler(product._id)}
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

                    {/* PAGINAÇÃO SIMPLES */}
                    {pages > 1 && (
                        <div className="flex justify-center mt-8 gap-2">
                            {[...Array(pages).keys()].map((x) => (
                                <Link
                                    key={x + 1}
                                    to={`/admin/productlist/page/${x + 1}`}
                                    className={`px-4 py-2 rounded-md font-bold transition-all ${x + 1 === page
                                            ? 'bg-slate-900 text-white shadow-md scale-110'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {x + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductListScreen;