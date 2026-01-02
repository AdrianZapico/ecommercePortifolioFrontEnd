import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import type { Product as ProductType } from '../types/types';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductType | null>(null);
    const [qty, setQty] = useState(1); // Estado para guardar a quantidade escolhida

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${productId}`);
                setProduct(data);
            } catch (error) {
                console.error("Erro ao buscar produto", error);
            }
        };
        fetchProduct();
    }, [productId]);

    // --- AQUI ESTÁ A MÁGICA ---
    const addToCartHandler = () => {
        if (product) {
            dispatch(addToCart({ ...product, qty })); // Manda pro Redux
            navigate('/cart'); // Redireciona para a tela do carrinho (vamos criar jaja)
        }
    };

    if (!product) {
        return <h2 className="text-center mt-10">Carregando...</h2>;
    }

    return (
        <div className="container mx-auto mt-5">
            <Link to="/" className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300 transition">
                Voltar
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Imagem */}
                <div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>

                {/* Detalhes */}
                <div className="flex flex-col gap-4">
                    <div className="border-b pb-4">
                        <h3 className="text-2xl font-bold text-slate-800">{product.name}</h3>
                        <p className="text-yellow-600 font-bold mt-2">
                            {product.rating} Estrelas ({product.numReviews} Reviews)
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-2">
                            R$ {product.price.toFixed(2)}
                        </p>
                    </div>

                    <p className="text-gray-600">{product.description}</p>

                    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50 mt-4">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <span className="font-semibold">Preço:</span>
                            <span className="text-lg">R$ {product.price.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <span className="font-semibold">Status:</span>
                            <span className={product.countInStock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {product.countInStock > 0 ? 'Em Estoque' : 'Esgotado'}
                            </span>
                        </div>

                        {/* SELETOR DE QUANTIDADE (Só aparece se tiver estoque) */}
                        {product.countInStock > 0 && (
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <span className="font-semibold">Quantidade:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="form-select border border-gray-300 rounded p-1"
                                >
                                    {/* Cria opções de 1 até o limite do estoque (max 10 pra não travar a tela) */}
                                    {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={addToCartHandler} // <--- Ação do Clique
                            className={`w-full py-3 rounded text-white font-bold transition
                ${product.countInStock === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-slate-900 hover:bg-slate-800'}`
                            }
                            disabled={product.countInStock === 0}
                        >
                            {product.countInStock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;