import type { Product as ProductType } from '../types/types';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

interface ProductProps {
    product: ProductType;
}

const Product = ({ product }: ProductProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <Link to={`/product/${product._id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover object-center hover:opacity-95 transition-opacity"
                />
            </Link>

            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 truncate hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                className={index < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="text-gray-500 text-xs ml-2 font-medium">
                        ({product.numReviews} reviews)
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">
                        ${product.price.toFixed(2)}
                    </span>
                    {/* Optional: Add to cart button or similar could go here */}
                </div>
            </div>
        </div>
    );
};

export default Product;