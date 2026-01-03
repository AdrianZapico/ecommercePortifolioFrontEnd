import { useState, type FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import type { RootState } from '../store';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state: RootState) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        // Se não tiver endereço, joga o usuário de volta para a tela de entrega
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        // Próximo passo: Tela de Revisão do Pedido (Place Order)
        navigate('/placeorder');
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-slate-800">Método de Pagamento</h1>

                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Selecione uma opção:</h2>

                        <div className="flex items-center mb-4">
                            <input
                                type="radio"
                                id="PayPal"
                                name="paymentMethod"
                                value="PayPal"
                                className="w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 focus:ring-slate-500"
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="PayPal" className="ml-2 text-gray-900 font-medium">
                                PayPal ou Cartão de Crédito
                            </label>
                        </div>

                        {/* Você pode adicionar mais opções aqui no futuro, como PIX */}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition"
                    >
                        Continuar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentScreen;