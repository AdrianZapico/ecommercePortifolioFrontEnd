import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';// <--- Importamos a conexão certa
import { clearCartItems } from '../slices/cartSlice'; // <--- Ação para limpar carrinho
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state: any) => state.cart);

    // Hook do Redux para criar pedido
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            // Tenta criar o pedido na API certa
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();

            // Se der certo, limpa o carrinho e vai para a tela do pedido
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 step3 step4 />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                {/* Lado Esquerdo: Resumo dos Dados */}
                <div className="md:col-span-2 space-y-6">

                    {/* Endereço */}
                    <div className="bg-white p-6 rounded shadow-sm border">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Entrega</h2>
                        <p className="text-slate-600">
                            <strong className="text-slate-800">Endereço: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Pagamento */}
                    <div className="bg-white p-6 rounded shadow-sm border">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Pagamento</h2>
                        <strong className="text-slate-800">Método: </strong>
                        {cart.paymentMethod}
                    </div>

                    {/* Itens */}
                    <div className="bg-white p-6 rounded shadow-sm border">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Itens do Pedido</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Seu carrinho está vazio</Message>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div className="flex items-center space-x-4">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                            <Link to={`/product/${item._id}`} className="text-slate-700 hover:text-slate-900 font-medium">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-slate-600">
                                            {item.qty} x ${item.price} = <span className="font-bold text-slate-800">${(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado Direito: Resumo de Valores */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded shadow-md border">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2 text-center">Resumo do Pedido</h2>

                        <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between">
                                <span>Itens</span>
                                <span>${cart.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frete</span>
                                <span>${cart.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxa</span>
                                <span>${cart.taxPrice}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-slate-900 border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>${cart.totalPrice}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            {error && (
                                <Message variant='danger'>
                                    {(error as any)?.data?.message || 'Erro ao criar pedido'}
                                </Message>
                            )}
                        </div>

                        <button
                            type='button'
                            className={`w-full mt-6 py-3 rounded font-bold text-white transition-colors ${cart.cartItems.length === 0 || isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-slate-800 hover:bg-slate-700'
                                }`}
                            disabled={cart.cartItems.length === 0 || isLoading}
                            onClick={placeOrderHandler}
                        >
                            {isLoading ? 'Processando...' : 'Confirmar Pedido'}
                        </button>

                        {isLoading && <div className="mt-4"><Loader /></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;