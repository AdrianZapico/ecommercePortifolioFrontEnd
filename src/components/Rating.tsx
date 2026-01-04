import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

type RatingProps = {
    value: number;
    text?: string;
    color?: string;
};

const Rating = ({ value, text, color = '#f8e825' }: RatingProps) => {
    return (
        <div className="flex items-center mb-2">
            {/* Lógica para as 5 estrelas */}
            {[1, 2, 3, 4, 5].map((index) => (
                <span key={index} style={{ color }} className="mr-1">
                    {value >= index ? (
                        <FaStar /> // Estrela Cheia
                    ) : value >= index - 0.5 ? (
                        <FaStarHalfAlt /> // Meia Estrela
                    ) : (
                        <FaRegStar /> // Estrela Vazia
                    )}
                </span>
            ))}

            {/* Texto opcional (ex: "12 avaliações") */}
            {text && <span className="ml-2 text-sm text-gray-600 font-semibold">{text}</span>}
        </div>
    );
};

export default Rating;