import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/apiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber: pageNumber || 1
    });

    const products = data?.products || [];

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

                    {products.length === 0 && <Message>Nenhum produto encontrado.</Message>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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