import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify'; // Opcional: para mensagens bonitas, senão usamos alert
import type { RootState } from '../store';
// import { clearCartItems } from '../slices/cartSlice'; // Faremos isso depois

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state: RootState) => state.cart);
    const { userInfo } = useSelector((state: RootState) => state.auth);

    // Redireciona se não tiver endereço
    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            // 1. Prepara o cabeçalho com o Token
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            // 2. Envia os dados para o Backend
            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                config
            );

            // 3. Sucesso! Redireciona para os detalhes do pedido criado
            // dispatch(clearCartItems()); // Limparemos o carrinho depois
            navigate(`/order/${data._id}`);

        } catch (error: any) {
            const msg = error.response?.data?.message || error.message;
            alert(msg); // Ou use toast.error(msg)
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            {/* STEPS WIZARD (Barra de progresso visual simples) */}
            <div className="flex justify-center mb-8 text-sm">
                <span className="text-green-600 font-bold mr-4">Login ✅</span>
                <span className="text-green-600 font-bold mr-4">Endereço ✅</span>
                <span className="text-green-600 font-bold mr-4">Pagamento ✅</span>
                <span className="font-bold underline">Revisão</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* COLUNA DA ESQUERDA: DETALHES */}
                <div className="md:w-2/3">
                    <div className="bg-white p-6 rounded shadow-sm mb-4">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Entrega</h2>
                        <p className="mb-2">
                            <strong>Endereço: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm mb-4">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Pagamento</h2>
                        <p>
                            <strong>Método: </strong>
                            {cart.paymentMethod}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm mb-4">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Itens do Pedido</h2>
                        {cart.cartItems.length === 0 ? (
                            <p>Seu carrinho está vazio</p>
                        ) : (
                            <ul>
                                {cart.cartItems.map((item, index) => (
                                    <li key={index} className="flex items-center justify-between border-b py-2">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded mr-4"
                                            />
                                            <Link to={`/product/${item._id}`} className="text-slate-900 hover:underline">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-600">
                                            {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* COLUNA DA DIREITA: RESUMO FINANCEIRO */}
                <div className="md:w-1/3">
                    <div className="bg-white p-6 rounded shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Resumo do Pedido</h2>

                        <div className="flex justify-between mb-2">
                            <span>Itens</span>
                            <span>${cart.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Frete</span>
                            <span>${cart.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Taxa</span>
                            <span>${cart.taxPrice}</span>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between mb-6 font-bold text-lg">
                            <span>Total</span>
                            <span>${cart.totalPrice}</span>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition disabled:opacity-50"
                            disabled={cart.cartItems.length === 0}
                            onClick={placeOrderHandler}
                        >
                            Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;