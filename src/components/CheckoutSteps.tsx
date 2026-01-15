import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }: any) => {
    // Estilo base para os links
    const linkStyle = "text-slate-800 font-bold hover:text-blue-600 transition-colors";
    const disabledStyle = "text-gray-400 cursor-not-allowed";

    return (
        <nav className="flex justify-center mb-8">
            <ul className="flex space-x-4 md:space-x-8 text-sm md:text-base">
                <li>
                    {step1 ? (
                        <Link to='/login' className={linkStyle}>Sign In</Link>
                    ) : (
                        <span className={disabledStyle}>Sign In</span>
                    )}
                </li>

                <li>
                    {step2 ? (
                        <Link to='/shipping' className={linkStyle}>Shipping</Link>
                    ) : (
                        <span className={disabledStyle}>Shipping</span>
                    )}
                </li>

                <li>
                    {step3 ? (
                        <Link to='/payment' className={linkStyle}>Payment</Link>
                    ) : (
                        <span className={disabledStyle}>Payment</span>
                    )}
                </li>

                <li>
                    {step4 ? (
                        <Link to='/placeorder' className={linkStyle}>Place Order</Link>
                    ) : (
                        <span className={disabledStyle}>Place Order</span>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default CheckoutSteps;