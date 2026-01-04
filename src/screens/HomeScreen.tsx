import { useEffect, useState } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import ProductCarousel from '../components/ProductCarousel';
import type { Product as ProductType } from '../types/types';

const HomeScreen = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    // Adicionamos estados para controlar o carregamento e erros
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // O proxy no vite.config.ts redireciona /api para localhost:5000
                const { data } = await axios.get('/api/products');
                setProducts(data);
                setLoading(false);
            } catch (err: any) {
                // Tratamento de erro básico
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            {/* 1. Carrossel de Destaques no topo */}
            <ProductCarousel />

            <h1 className="text-3xl font-bold text-slate-800 mb-6 mt-8">Últimos Produtos</h1>

            {/* 2. Verificação de Loading e Erro antes de mostrar a lista */}
            {loading ? (
                <p className="text-center text-lg text-slate-500">Carregando produtos...</p>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                    {error}
                </div>
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