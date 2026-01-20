import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex items-center">
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Pesquisar produtos..."
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-800"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-slate-700 text-white font-bold rounded-r-md hover:bg-slate-600 transition"
            >
                Buscar
            </button>
        </form>
    );
};

export default SearchBox;