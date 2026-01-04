import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaCaretDown } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react'; // Para o dropdown simples
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox'; // <--- Importado
import type { RootState } from '../store';

const Header = () => {
    const { cartItems } = useSelector((state: RootState) => state.cart);
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    // Estado simples para controlar dropdowns (se não estiver usando biblioteca de UI)
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* LOGO */}
                <Link to="/" className="text-2xl font-bold font-mono italic hover:text-gray-300">
                    TechShop
                </Link>

                {/* --- BARRA DE BUSCA (Nova) --- */}
                <div className="hidden md:block w-1/3">
                    <SearchBox />
                </div>

                {/* NAVEGAÇÃO */}
                <nav className="flex items-center space-x-6 relative">

                    {/* Carrinho */}
                    <Link to="/cart" className="flex items-center gap-1 hover:text-yellow-400 transition relative">
                        <FaShoppingCart />
                        <span>Carrinho</span>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-yellow-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {cartItems.reduce((acc: number, item: any) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {/* Área do Usuário / Login */}
                    {userInfo ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-1 hover:text-yellow-400 focus:outline-none"
                            >
                                {userInfo.name} <FaCaretDown />
                            </button>

                            {/* Dropdown do Usuário */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-slate-800 z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        Perfil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logoutHandler();
                                            setShowUserMenu(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1 hover:text-yellow-400 transition">
                            <FaUser />
                            <span>Login</span>
                        </Link>
                    )}

                    {/* Área do Admin */}
                    {userInfo && userInfo.isAdmin && (
                        <div className="relative ml-4">
                            <button
                                onClick={() => setShowAdminMenu(!showAdminMenu)}
                                className="flex items-center gap-1 text-yellow-400 hover:text-white focus:outline-none font-bold"
                            >
                                Admin <FaCaretDown />
                            </button>

                            {/* Dropdown do Admin */}
                            {showAdminMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-slate-800 z-50">
                                    <Link
                                        to="/admin/productlist"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                        onClick={() => setShowAdminMenu(false)}
                                    >
                                        Produtos
                                    </Link>
                                    <Link
                                        to="/admin/userlist"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                        onClick={() => setShowAdminMenu(false)}
                                    >
                                        Usuários
                                    </Link>
                                    <Link
                                        to="/admin/orderlist"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                        onClick={() => setShowAdminMenu(false)}
                                    >
                                        Pedidos
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                </nav>
            </div>
        </header>
    );
};

export default Header;
