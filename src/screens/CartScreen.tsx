import { useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios'; // <--- Importante para buscar os dados do produto
import { addToCart, removeFromCart } from '../slices/cartSlice';
import type { RootState } from '../store';
import type { CartItem } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Pega o ID da URL (se houver)
    const { id } = useParams();

    // 2. Pega a quantidade da URL (?qty=1)
    const { search } = useLocation();
    const qty = search ? Number(new URLSearchParams(search).get('qty')) : 1;

    // Pega os dados do carrinho do Redux
    const cart = useSelector((state: RootState) => state.cart);
    const { cartItems } = cart;

    // --- LÓGICA NOVA: Se tiver ID na URL, busca o produto e adiciona ---
    useEffect(() => {
        if (id) {
            const addItem = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${id}`);

                    // Monta o objeto do produto para salvar no Redux
                    dispatch(addToCart({
                        _id: data._id,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                        countInStock: data.countInStock,
                        qty
                    }));
                } catch (error) {
                    console.error('Erro ao adicionar item:', error);
                }
            };
            addItem();
        }
    }, [dispatch, id, qty]);
    // ------------------------------------------------------------------

    const addToCartHandler = (product: CartItem, qty: number) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        // Redireciona para login, depois para shipping
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="container mx-auto mt-5 px-4">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Carrinho de Compras</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Lado Esquerdo: Lista de Itens */}
                <div className="md:w-2/3">
                    {cartItems.length === 0 ? (
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded" role="alert">
                            Seu carrinho está vazio. <Link to="/" className="font-bold underline ml-2">Voltar para a Loja</Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded shadow-sm border border-gray-100 gap-4">
                                    <div className="flex items-center gap-4 flex-1 w-full">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                        <Link to={`/product/${item._id}`} className="font-bold text-slate-700 hover:text-slate-900">
                                            {item.name}
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                                        <span className="font-bold text-slate-600 whitespace-nowrap">R$ {item.price}</span>

                                        <select
                                            className="form-select border border-gray-300 rounded p-1"
                                            value={item.qty}
                                            onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                        >
                                            {[...Array(item.countInStock).keys()].slice(0, 10).map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={() => removeFromCartHandler(item._id)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lado Direito: Resumo do Pedido */}
                <div className="md:w-1/3">
                    <div className="border border-gray-200 rounded-lg shadow-sm bg-gray-50 p-6 sticky top-4">
                        <h2 className="text-xl font-bold border-b pb-4 mb-4 text-slate-800">
                            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) itens
                        </h2>

                        <div className="text-2xl font-bold text-slate-900 mb-6">
                            R$ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </div>

                        <button
                            onClick={checkoutHandler}
                            disabled={cartItems.length === 0}
                            className={`w-full py-3 rounded text-white font-bold transition
                ${cartItems.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-slate-900 hover:bg-slate-800'}`
                            }
                        >
                            Fechar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;