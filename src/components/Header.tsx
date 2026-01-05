import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaCaretDown, FaSignOutAlt, FaBox, FaUsers, FaClipboardList } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import type { RootState } from '../store';

const Header = () => {
    const { cartItems } = useSelector((state: RootState) => state.cart);
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    // Refs para detectar cliques fora
    const userMenuRef = useRef<HTMLDivElement>(null);
    const adminMenuRef = useRef<HTMLDivElement>(null);

    const logoutHandler = () => {

        dispatch(logout());
        setShowUserMenu(false);
        navigate('/login');
    };
    // Fecha os menus se clicar em qualquer lugar fora deles
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
                setShowAdminMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-800">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">

                {/* LOGO */}
                <Link to="/" className="text-2xl font-bold font-mono italic hover:text-yellow-400 transition-colors">
                    TechShop
                </Link>

                {/* BARRA DE BUSCA */}
                <div className="hidden md:block w-1/3">
                    <SearchBox />
                </div>

                {/* NAVEGAÇÃO */}
                <nav className="flex items-center space-x-6">

                    {/* Carrinho */}
                    <Link to="/cart" className="flex items-center gap-2 hover:text-yellow-400 transition relative group">
                        <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Carrinho</span>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -left-2 bg-yellow-500 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                                {cartItems.reduce((acc: number, item: any) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {/* Área do Usuário */}
                    {userInfo ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => {
                                    setShowUserMenu(!showUserMenu);
                                    setShowAdminMenu(false);
                                }}
                                className={`flex items-center gap-1 py-2 px-3 rounded-md transition-colors focus:outline-none ${showUserMenu ? 'bg-slate-800 text-yellow-400' : 'hover:bg-slate-800'}`}
                            >
                                <span className="font-medium">{userInfo.name}</span>
                                <FaCaretDown className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl py-2 text-slate-700 z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <FaUser className="text-slate-400" /> Perfil
                                    </Link>
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors border-t border-slate-50"
                                    >
                                        <FaSignOutAlt /> Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 hover:text-yellow-400 transition group">
                            <FaUser className="group-hover:scale-110 transition-transform" />
                            <span>Entrar</span>
                        </Link>
                    )}

                    {/* Área do Admin */}
                    {userInfo && userInfo.isAdmin && (
                        <div className="relative" ref={adminMenuRef}>
                            <button
                                onClick={() => {
                                    setShowAdminMenu(!showAdminMenu);
                                    setShowUserMenu(false);
                                }}
                                className={`flex items-center gap-1 py-2 px-3 rounded-md font-bold transition-colors focus:outline-none ${showAdminMenu ? 'bg-yellow-500 text-slate-900' : 'text-yellow-400 hover:bg-yellow-500/10'}`}
                            >
                                ADMIN <FaCaretDown className={`transition-transform duration-200 ${showAdminMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showAdminMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl py-2 text-slate-700 z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2">
                                    <Link
                                        to="/admin/productlist"
                                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                        onClick={() => setShowAdminMenu(false)}
                                    >
                                        <FaBox className="text-slate-400" /> Produtos
                                    </Link>
                                    <Link
                                        to="/admin/userlist"
                                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                        onClick={() => setShowAdminMenu(false)}
                                    >
                                        <FaUsers className="text-slate-400" /> Usuários
                                    </Link>
                                    <Link
                                        to="/admin/orderlist"
                                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors border-t border-slate-50"
                                        onClick={() => setShowAdminMenu(false)}
                                    >
                                        <FaClipboardList className="text-slate-400" /> Pedidos
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