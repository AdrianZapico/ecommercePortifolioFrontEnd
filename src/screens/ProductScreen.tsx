import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/apiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);

    // Busca os detalhes do produto usando o ID da URL
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to='/' className='bg-slate-200 px-4 py-2 rounded mb-4 inline-block hover:bg-slate-300 text-slate-800 transition-colors'>
                &larr; Voltar
            </Link>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {(error as any)?.data?.message || 'Erro ao carregar produto'}
                </Message>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {/* Coluna da Imagem */}
                    <div className="flex justify-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Coluna das Informações */}
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-slate-800">{product.name}</h3>

                        <div className="border-b border-slate-200 pb-2">
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        </div>

                        <div className="text-2xl font-bold text-slate-700">
                            Price: ${product.price}
                        </div>

                        <p className="text-slate-600 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Caixa de Ação (Comprar) */}
                        <div className="bg-white p-6 border rounded-lg shadow-sm mt-4">
                            <div className="flex justify-between mb-4 border-b pb-2">
                                <span className="font-bold">Preço:</span>
                                <span className="text-slate-800">${product.price}</span>
                            </div>

                            <div className="flex justify-between mb-4 border-b pb-2">
                                <span className="font-bold">Status:</span>
                                <span className={product.countInStock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                    {product.countInStock > 0 ? 'Em Estoque' : 'Esgotado'}
                                </span>
                            </div>

                            {product.countInStock > 0 && (
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold">Qtd:</span>
                                    <select
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        className="border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    >
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={addToCartHandler}
                                disabled={product.countInStock === 0}
                                className={`w-full py-3 px-4 rounded font-bold text-white transition-colors ${product.countInStock === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-slate-800 hover:bg-slate-700'
                                    }`}
                            >
                                {product.countInStock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductScreen;