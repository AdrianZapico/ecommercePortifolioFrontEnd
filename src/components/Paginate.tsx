import { Link } from 'react-router-dom';

type PaginateProps = {
    pages: number;
    page: number;
    isAdmin?: boolean;
    keyword?: string;
};

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }: PaginateProps) => {
    return (
        pages > 1 ? (
            <div className="flex justify-center mt-8">
                {[...Array(pages).keys()].map((x) => (
                    <Link
                        key={x + 1}
                        to={
                            !isAdmin
                                ? keyword
                                    ? `/search/${keyword}/page/${x + 1}`
                                    : `/page/${x + 1}`
                                : `/admin/productlist/${x + 1}`
                        }
                        className={`px-4 py-2 mx-1 border rounded ${x + 1 === page
                                ? 'bg-slate-800 text-white border-slate-800' // Estilo do Ativo
                                : 'bg-white text-slate-700 hover:bg-gray-100' // Estilo Padrão
                            }`}
                    >
                        {x + 1}
                    </Link>
                ))}
            </div>
        ) : null
    );
};

export default Paginate;