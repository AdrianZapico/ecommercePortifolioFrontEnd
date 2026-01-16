import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
// 👇 A MÁGICA: Importamos os hooks do Redux em vez do axios manual
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
    // 1. Pega a página da URL
    const { pageNumber } = useParams();

    // 2. BUSCA DE DADOS (Substitui o useEffect e axios.get)
    // O Redux cuida de carregar, erro e atualizar sozinho
    const { data, isLoading, error, refetch } = useGetProductsQuery({
        pageNumber: pageNumber || 1
    });

    // 3. HOOKS DE AÇÃO (Substitui axios.post e axios.delete)
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const deleteHandler = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await deleteProduct(id);
                // Não precisa chamar fetchProducts(), o Redux atualiza a lista sozinho!
                refetch();
                toast.success('Produto excluído com sucesso');
            } catch (err: any) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Deseja criar um novo produto rascunho?')) {
            try {
                await createProduct({});
                refetch();
                toast.success('Produto criado');
                // Nota: O backend deve criar o produto e o Redux atualizará a lista. 
                // Se quiser redirecionar para edição imediata, precisariamos pegar o ID retornado,
                // mas por enquanto vamos apenas atualizar a lista para evitar erros.
            } catch (err: any) {
                toast.error(err?.data?.message || err.error);
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

            {/* LOADER DE AÇÕES RÁPIDAS */}
            {(loadingCreate || loadingDelete) && <Loader />}

            {/* TABELA PRINCIPAL */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
                </div>
            ) : error ? (
                <Message variant='danger'>{(error as any)?.data?.message || 'Erro ao carregar produtos'}</Message>
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
                                {/* O Redux devolve 'data' contendo 'products' */}
                                {data.products.map((product: any) => (
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

                    {/* PAGINAÇÃO (Usando dados vindos do Redux: data.pages e data.page) */}
                    {data.pages > 1 && (
                        <div className="flex justify-center mt-8 gap-2">
                            {[...Array(data.pages).keys()].map((x) => (
                                <Link
                                    key={x + 1}
                                    to={`/admin/productlist/${x + 1}`} // Ajustei a URL para o padrão comum
                                    className={`px-4 py-2 rounded-md font-bold transition-all ${x + 1 === data.page
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