import { useEffect, useState } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import type { Product as ProductType } from '../types/types';


const HomeScreen = () => {
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            // O proxy no vite.config.ts redireciona /api para localhost:5000
            const { data } = await axios.get('/api/products');
            setProducts(data);
        };

        fetchProducts();
    }, []);

    return (
        <>
            <h1 className="text-2xl font-bold text-slate-700 mb-6">Últimos Produtos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </>
    );
};

export default HomeScreen;