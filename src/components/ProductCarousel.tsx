import { Link } from 'react-router-dom';
import Loader from './Loader';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/apiSlice';

const ProductCarousel = () => {
    // 1. Usa a função que criamos no passo anterior
    const { data: products, isLoading, error } = useGetTopProductsQuery({});

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>
            {/* Proteção contra erros de conexão */}
            {(error as any)?.data?.message || 'Erro ao carregar destaques'}
        </Message>
    ) : (
        // 2. Visual em Tailwind (Rolagem Horizontal Suave)
        <div className='mb-8'>
            <h2 className='text-2xl font-bold text-slate-800 mb-4'>Destaques</h2>

            {/* Container de rolagem horizontal */}
            <div className='flex overflow-x-auto space-x-6 pb-4 scrollbar-hide'>
                {products?.map((product: any) => (
                    <div key={product._id} className='min-w-[300px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
                        <Link to={`/product/${product._id}`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className='w-full h-48 object-cover rounded-t-lg'
                            />
                            <div className='p-4'>
                                <h3 className='text-lg font-semibold text-slate-700 truncate'>
                                    {product.name}
                                </h3>
                                <p className='text-slate-500 font-bold'>
                                    ${product.price}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;