import { MdOutlineDarkMode } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";
import { useThemeStore } from "../store/themeStore";

function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            type="button"
            className="mx-3 rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={toggleTheme}
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
