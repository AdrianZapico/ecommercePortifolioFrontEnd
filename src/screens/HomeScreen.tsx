import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import ProductCarousel from '../components/ProductCarousel';
import Paginate from '../components/Paginate'; // <--- 1. Importe
import type { Product as ProductType } from '../types/types';

const HomeScreen = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados novos para paginação
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    // Agora pegamos também o pageNumber da URL
    const { keyword, pageNumber } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Passamos keyword E pageNumber na URL
                const { data } = await axios.get(
                    `/api/products?keyword=${keyword || ''}&pageNumber=${pageNumber || 1}`
                );

                // O Backend agora retorna { products, page, pages }
                setProducts(data.products);
                setPage(data.page);
                setPages(data.pages);

                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, pageNumber]); // <--- Roda quando muda a busca ou a página

    return (
        <>
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
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Adiciona o componente de paginação no final */}
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </>
            )}
        </>
    );
};

export default HomeScreen;