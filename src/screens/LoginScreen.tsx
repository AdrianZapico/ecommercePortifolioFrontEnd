import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading, error }] = useLoginMutation();

    const { userInfo } = useSelector((state: any) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e: any) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();

            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[50vh] mt-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">Login</h1>

                {error && (
                    <Message variant='danger'>
                        {(error as any)?.data?.message || (error as any)?.error || 'Erro no Login'}
                    </Message>
                )}

                {isLoading && <Loader />}

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter email"
                            className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-slate-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-slate-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded hover:bg-slate-700 transition duration-300"
                        disabled={isLoading}
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-slate-600">
                        New Customer?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-blue-600 hover:text-blue-800 font-bold">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;