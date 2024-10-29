import ThemeToggle from "../ThemeToggle";

function Appbar({ name }) {
    return (
        <div className="h-20 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center relative bg-white dark:bg-gray-900">
            <p className="font-medium text-2xl text-center text-gray-900 dark:text-white">
                Welcome, <span className="font-bold">{name}</span>
            </p>
            <div className="absolute right-4">
                <ThemeToggle />
            </div>
        </div>
    );
}

export default Appbar;