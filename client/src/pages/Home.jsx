import Header from "../components/Header";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white">
            <Header />

            <div className="relative flex flex-col items-center justify-center">
                <div className="relative top-32 max-w-4xl">
                    <h1 className="text-5xl text-center font-extrabold sm:text-7xl">
                        Making Payments Easy, One Tap at a Time.
                    </h1>
                    <p className="my-4 font-medium text-center">
                        YoPayment is a digital wallet that allows you to make payments, receive money, and manage your finances. It's fast, secure, and easy to use.
                    </p>
                    <div className="flex justify-center relative z-10">
                        <Link to={'/signup'}>
                            <button className="rounded-xl bg-gray-800 px-16 py-3 text-white dark:bg-white dark:text-black">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>


            <div className="relative top-[10vh] max-w-full sm:top-0">
                <div className="absolute w-full object-contain">
                    <img src="/circle.png" alt="Circle" className="relative object-fill" />
                </div>
            </div>
        </div>
    );
}

export default Home
