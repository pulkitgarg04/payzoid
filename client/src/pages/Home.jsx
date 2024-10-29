import Header from "../components/Home/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header />

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative flex flex-col items-center justify-center"
      >
        <div className="relative top-24 max-w-4xl px-4">
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold"
          >
            Making Payments Easy, One Tap at a Time.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="my-5 font-medium text-center text-base sm:text-lg md:text-xl"
          >
            PayZoid is a digital wallet that allows you to make payments, receive money, and manage your finances. It's fast, secure, and easy to use.
          </motion.p>
          <div className="flex justify-center relative z-10">
            <Link to={'/signup'}>
              <motion.button
                variants={itemVariants}
                className="rounded-xl bg-gray-800 px-10 py-3 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="relative top-[10vh] max-w-full sm:top-0">
        <motion.div
          className="absolute w-full object-contain"
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <img src="/circle.png" alt="Circle" className="relative object-fill" />
        </motion.div>
      </div>
    </div>
  );
}

export default Home;