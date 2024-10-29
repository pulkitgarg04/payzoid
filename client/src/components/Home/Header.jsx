import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

function Header() {
    return (
        <nav className="container relative mx-auto flex w-full items-center justify-around px-5 py-3 text-xl bg-white dark:bg-gray-900 text-black dark:text-white">
            <div className="text-2xl font-bold font-Manropea">PAYZOID</div>
            <div className="flex items-center justify-around">
                <ul className="mx-3 flex">
                    <Link to="/"><li className="mx-3">Home</li></Link>
                    <Link to="/about"><li className="mx-3">About</li></Link>
                    <Link to="/contact"><li className="mx-3">Contact</li></Link>
                </ul>
                <ThemeToggle />
            </div>
        </nav>
    )
}

export default Header