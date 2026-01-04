import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCarousel = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const { data } = await axios.get('/api/products/top');
                setProducts(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, []);

    // Lógica de Rotação Automática (Timer)
    useEffect(() => {
        if (products.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === products.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000); // Troca a cada 5 segundos

            return () => clearInterval(interval);
        }
    }, [products]);

    // Se estiver carregando ou der erro, não mostra nada (para não quebrar o layout)
    if (loading) return null;
    if (error) return <div className="text-red-500 mb-4">Erro ao carregar destaques</div>;
    if (products.length === 0) return null;

    return (
        <div className="relative w-full h-80 md:h-96 bg-slate-900 rounded-lg overflow-hidden shadow-xl mb-10 group">
            {/* Imagem de Fundo */}
            <Link to={`/product/${products[currentIndex]._id}`}>
                <img
                    src={products[currentIndex].image}
                    alt={products[currentIndex].name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />

                {/* Texto Sobreposto (Legenda) */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-white text-2xl md:text-4xl font-bold">
                        {products[currentIndex].name} <span className="text-yellow-400">(${products[currentIndex].price})</span>
                    </h2>
                    <p className="text-gray-300 mt-2 line-clamp-2 w-3/4">
                        {products[currentIndex].description}
                    </p>
                </div>
            </Link>

            {/* Indicadores (Bolinhas) */}
            <div className="absolute bottom-4 right-4 flex gap-2">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-yellow-400' : 'bg-gray-500'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;