import { useState, useEffect } from 'react';

function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <nav className="container relative mx-auto flex w-full items-center justify-around px-5 py-3 text-xl bg-white dark:bg-gray-900 text-black dark:text-white">
            <div className="text-2xl font-bold font-Manrope">PAYZOID</div>
            <div className="flex items-center justify-around">
                <ul className="mx-3 flex">
                    <li className="mx-3">Home</li>
                    <li className="mx-3">About</li>
                    <li className="mx-3">Contact</li>
                </ul>

                <button
                    type="button"
                    className={`${isDarkMode ? 'hidden' : 'block'} mx-3 rounded-full p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700`}
                    onClick={toggleDarkMode}
                >
                    <span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                        </svg>
                    </span>
                </button>

                <button
                    type="button"
                    className={`${isDarkMode ? 'block' : 'hidden'} mx-3 rounded-full p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700`}
                    onClick={toggleDarkMode}
                >
                    <span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M12 2v2"></path>
                            <path d="M12 20v2"></path>
                            <path d="m4.93 4.93 1.41 1.41"></path>
                            <path d="m17.66 17.66 1.41 1.41"></path>
                            <path d="M2 12h2"></path>
                            <path d="M20 12h2"></path>
                            <path d="m6.34 17.66-1.41 1.41"></path>
                            <path d="m19.07 4.93-1.41 1.41"></path>
                        </svg>
                    </span>
                </button>

            </div>
        </nav>
    )
}

export default Header
