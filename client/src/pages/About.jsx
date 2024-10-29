import Header from "../components/Home/Header";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

const letterContainerVariants = {
    before: { transition: { staggerChildren: 0.05 } },
    after: { transition: { staggerChildren: 0.03 } },
};

const letterVariants = {
    before: {
        opacity: 0,
        y: 20,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 200,
        },
    },
    after: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 200,
        },
    },
};

const StyledTitleElement = styled(motion.h2)`
  font-size: calc(32px + (80 - 32) * ((100vw - 320px) / (1600 - 320)));
  line-height: calc(32px + (80 - 32) * ((100vw - 320px) / (1600 - 320)));
  display: inline-block;
  max-width: 100%;
  word-break: break-word;
  z-index: 10;
  color: black;
`;

const About = () => {
    const words = ["ANYONE", "ANYWHERE", "ANYTIME"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 4500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white">
            <Header />

            <div className="relative flex flex-col items-center justify-center z-10">
                <div className="relative top-12 px-4">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex flex-col mx-5">
                            <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold">
                                SEND MONEY TO
                            </h2>
                            <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={words[currentWordIndex]}
                                        variants={letterContainerVariants}
                                        initial="before"
                                        animate="after"
                                        exit="before"
                                        transition={{ duration: 0.5 }}
                                    >
                                        {words[currentWordIndex].split("").map((letter, index) => (
                                            <motion.span
                                                key={index}
                                                variants={letterVariants}
                                                style={{ display: "inline-block", width: "auto" }}
                                            >
                                                {letter === " " ? "\u00A0" : letter}
                                            </motion.span>
                                        ))}
                                    </motion.span>
                                </AnimatePresence>
                            </h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="border-4 border-gray-800 dark:border-gray-200 rounded-lg shadow-lg w-2/3 overflow-hidden"
                        >
                            <img
                                src="dashboard.png"
                                alt="dashboard"
                                className="object-cover w-full"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="relative bottom-[30vh] max-w-full">
                <div className="absolute w-full object-contain">
                    <img src="/circle.png" alt="Circle" className="relative object-fill" />
                </div>
            </div>
        </div>
    );
};

export default About;