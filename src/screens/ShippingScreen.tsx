import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import type { RootState } from '../store';

const ShippingScreen = () => {
    // Pega o endereço salvo anteriormente (se houver) para preencher o form
    const cart = useSelector((state: RootState) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        // Salva no Redux
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        // Vai para a próxima etapa (Pagamento)
        navigate('/payment');
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-slate-800">Endereço de Entrega</h1>

                <form onSubmit={submitHandler}>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Endereço</label>
                        <input
                            type="text"
                            placeholder="Ex: Rua das Flores, 123"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Cidade</label>
                        <input
                            type="text"
                            placeholder="Ex: São Paulo"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">CEP</label>
                        <input
                            type="text"
                            placeholder="Ex: 01001-000"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">País</label>
                        <input
                            type="text"
                            placeholder="Ex: Brasil"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition"
                    >
                        Continuar para Pagamento
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingScreen;