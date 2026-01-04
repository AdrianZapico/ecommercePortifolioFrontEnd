import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Rating from '../components/Rating';
import type { Product } from '../types/types';
import type { RootState } from '../store';

const ProductScreen = () => {
    const { id: productId } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados do Formulário de Review
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loadingReview, setLoadingReview] = useState(false);

    // Pega o usuário logado do Redux
    const { userInfo } = useSelector((state: RootState) => state.auth);

    // Função para buscar os dados (usada ao carregar e após avaliar)
    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`/api/products/${productId}`);
            setProduct(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    // Função para Enviar a Avaliação
    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingReview(true);

        try {
            // 1. Criamos a configuração com o Token
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token}`, // <--- O "Crachá" aqui!
                },
            };

            // 2. Passamos o config como terceiro argumento
            await axios.post(
                `/api/products/${productId}/reviews`,
                { rating, comment },
                config // <--- Enviamos aqui
            );

            setLoadingReview(false);
            toast.success('Avaliação enviada com sucesso!');

            setRating(0);
            setComment('');
            fetchProduct();

        } catch (err: any) {
            setLoadingReview(false);
            toast.error(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <h2 className="text-center mt-10">Carregando...</h2>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
    if (!product) return <div className="text-center mt-10">Produto não encontrado</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link className="btn bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 px-4 rounded mb-6 inline-block" to="/">
                Voltar
            </Link>

            {/* --- DETALHES DO PRODUTO (Parte de Cima) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="flex justify-center">
                    <img src={product.image} alt={product.name} className="max-w-full h-auto rounded shadow-lg object-cover" style={{ maxHeight: '500px' }} />
                </div>

                <div>
                    <h3 className="text-3xl font-bold mb-4 text-slate-800">{product.name}</h3>

                    <div className="border-b border-gray-200 pb-4 mb-4">
                        {/* Se você não tiver o componente Rating, pode comentar esta linha */}
                        <Rating value={product.rating} text={`${product.numReviews} avaliações`} />
                    </div>

                    <p className="text-2xl font-bold mb-4 text-slate-700">R$ {product.price}</p>
                    <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                    <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                        <div className="flex justify-between mb-4 border-b pb-2">
                            <span className="font-semibold">Preço:</span>
                            <span>R$ {product.price}</span>
                        </div>
                        <div className="flex justify-between mb-6 border-b pb-2">
                            <span className="font-semibold">Status:</span>
                            <span className={product.countInStock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {product.countInStock > 0 ? 'Em Estoque' : 'Esgotado'}
                            </span>
                        </div>

                        {/* Botão Adicionar ao Carrinho (Simplificado para o exemplo) */}
                        <button
                            className={`w-full py-3 rounded uppercase font-bold text-white transition
                  ${product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700'}
                `}
                            disabled={product.countInStock === 0}
                        // Adicione sua lógica de adicionar ao carrinho aqui se já tiver
                        >
                            {product.countInStock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SEÇÃO DE AVALIAÇÕES (NOVIDADE AQUI) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 bg-slate-50 p-6 rounded-lg">

                {/* Lado Esquerdo: Lista de Comentários */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-slate-800">Avaliações</h2>

                    {product.reviews.length === 0 && (
                        <div className="bg-blue-100 text-blue-700 p-4 rounded">
                            Nenhuma avaliação ainda. Seja o primeiro!
                        </div>
                    )}

                    <div className="space-y-6">
                        {product.reviews.map((review: any, index: number) => (
                            <div key={review._id || index} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                                <strong className="block text-lg text-slate-700">{review.name}</strong>
                                <div className="flex items-center mb-2">
                                    {/* Mostra as estrelinhas da review específica */}
                                    <Rating value={review.rating} />
                                </div>
                                <p className="text-gray-500 text-sm mb-2">{review.createdAt?.substring(0, 10)}</p>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lado Direito: Formulário de Escrever Review */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-slate-800">Escreva uma Avaliação</h2>

                    {userInfo ? (
                        <form onSubmit={submitHandler} className="bg-white p-6 rounded shadow-md">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Nota</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-slate-500"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="1">1 - Ruim</option>
                                    <option value="2">2 - Razoável</option>
                                    <option value="3">3 - Bom</option>
                                    <option value="4">4 - Muito Bom</option>
                                    <option value="5">5 - Excelente</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Comentário</label>
                                <textarea
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="O que você achou do produto?"
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-slate-500"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loadingReview}
                                className="bg-slate-800 text-white py-2 px-4 rounded hover:bg-slate-700 font-bold w-full disabled:bg-gray-400"
                            >
                                {loadingReview ? 'Enviando...' : 'Enviar Avaliação'}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                            <p>
                                Por favor, <Link to="/login" className="font-bold underline">faça login</Link> para escrever uma avaliação.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;