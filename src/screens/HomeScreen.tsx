import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/apiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();

    // Hook do Redux conectado ao Render
    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber: pageNumber || 1
    });

    // --- ÁREA DE SEGURANÇA ---

    // 1. Log para DEBUG: Abra o console (F12) e veja o que aparece aqui.
    // Se aparecer "undefined", o problema é na store.ts.
    // Se aparecer os produtos, o problema estava no HTML.
    console.log("HomeScreen Data Recebido:", data);

    // 2. Proteção contra 'map is not a function':
    // Se 'data' for nulo ou 'products' não existir, usamos uma lista vazia []
    // Isso impede que o site quebre (Crash).
    const products = data?.products || [];

    // -------------------------

    return (
        <>
            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Link to='/' className='bg-slate-200 px-4 py-2 rounded mb-4 inline-block hover:bg-slate-300'>
                    &larr; Voltar
                </Link>
            )}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {'data' in error
                        ? (error as any).data.message
                        : (error as any).message || 'Erro desconhecido'
                    }
                </Message>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-slate-800 mb-6 mt-4">
                        Latest Products
                    </h1>

                    {/* Verificação extra: Se a lista estiver vazia (mas sem erro), avisa o usuário */}
                    {products.length === 0 && <Message>Nenhum produto encontrado.</Message>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Agora usamos a variável segura 'products' */}
                        {products.map((product: any) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="mt-8">
                        <Paginate
                            pages={data?.pages}
                            page={data?.page}
                            keyword={keyword ? keyword : ''}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default HomeScreen;