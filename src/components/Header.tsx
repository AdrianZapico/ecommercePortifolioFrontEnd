import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-slate-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold hover:text-gray-300">
                    TechShop
                </Link>

                {/* Navegação */}
                <nav className="flex items-center space-x-6">
                    <Link to="/cart" className="flex items-center gap-1 hover:text-yellow-400 transition">
                        <FaShoppingCart />
                        <span>Carrinho</span>
                    </Link>

                    <Link to="/login" className="flex items-center gap-1 hover:text-yellow-400 transition">
                        <FaUser />
                        <span>Login</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;