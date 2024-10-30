import { useState, useEffect } from 'react';
import { MdOutlineDarkMode } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";



function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    const toggleDarkMode = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    return (
        <button
            type="button"
            className="mx-3 rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={toggleDarkMode}
        >
            <span>
                {theme === 'dark' ? (
                    <MdOutlineDarkMode className='w-5 h-5 text-white' />
                ) : (
                    <IoIosSunny className='w-5 h-5' />
                )}
            </span>
        </button>
    )
}

export default ThemeToggle
