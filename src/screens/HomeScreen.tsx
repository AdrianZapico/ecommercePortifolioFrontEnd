import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // <--- 1. Importar useParams
import axios from 'axios';
import Product from '../components/Product';
import ProductCarousel from '../components/ProductCarousel';
import type { Product as ProductType } from '../types/types';

const HomeScreen = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // <--- 2. Pegar a palavra-chave da URL (ex: 'monitor')
    const { keyword } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // <--- 3. Passar a keyword para o backend (?keyword=monitor)
                // Se não tiver keyword, manda vazio (lista tudo)
                const { data } = await axios.get(`/api/products?keyword=${keyword || ''}`);

                setProducts(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]); // <--- 4. IMPORTANTE: Adicionar [keyword] aqui para recarregar quando mudar

    return (
        <>
            {/* Se NÃO for busca, mostra o Carrossel. Se FOR busca, mostra botão Voltar */}
            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Link to="/" className="bg-slate-200 px-4 py-2 rounded mb-4 inline-block hover:bg-slate-300">
                    &larr; Voltar
                </Link>
            )}

            <h1 className="text-3xl font-bold text-slate-800 mb-6 mt-4">
                {keyword ? `Resultados para: "${keyword}"` : 'Últimos Produtos'}
            </h1>

            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <div className="bg-red-100 p-3 rounded">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
            )}
        </>
    );
};

export default HomeScreen;