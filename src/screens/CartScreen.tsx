import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import type { RootState } from '../store';
import type { CartItem } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Pega os dados do carrinho direto do Redux
    const cart = useSelector((state: RootState) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product: CartItem, qty: number) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        // Vamos para o login primeiro. Se já estiver logado, redireciona para shipping
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Carrinho de Compras</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Lado Esquerdo: Lista de Itens */}
                <div className="md:w-2/3">
                    {cartItems.length === 0 ? (
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded" role="alert">
                            Seu carrinho está vazio. <Link to="/" className="font-bold underline">Voltar para a Loja</Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4 flex-1">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                        <Link to={`/product/${item._id}`} className="font-bold text-slate-700 hover:text-slate-900">
                                            {item.name}
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className="font-bold text-slate-600">R$ {item.price}</span>

                                        {/* Seletor de Quantidade (para alterar direto no carrinho) */}
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
                    <div className="border border-gray-200 rounded-lg shadow-sm bg-gray-50 p-6">
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