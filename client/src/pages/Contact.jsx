import Header from "../components/Home/Header";
import { motion } from "framer-motion";

const itemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
};

function Contact() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white">
            <Header />

            <section className="mt-5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
                        <motion.h2
                            variants={itemVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.3 }}
                            className="text-3xl font-extrabold text-gray-900 dark:text-white"
                        >
                            Visit Our Location
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="mt-4 text-lg text-gray-500 dark:text-gray-400"
                        >
                            We are located in Barnala, Punjab. Come visit us to learn more about our services and products.
                        </motion.p>
                    </div>
                    <div className="mt-10 lg:mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                variants={itemVariants}
                                initial="initial"
                                animate="animate"
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="rounded-lg overflow-hidden shadow-lg"
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27539.56537106138!2d75.52375291866316!3d30.366700234789054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3910f21485ea741d%3A0x262904ff63351750!2sBarnala%2C%20Punjab%2C%20India!5e0!3m2!1sen!2sus!4v1730224087002!5m2!1sen!2sus"
                                    width="100%"
                                    height="350"
                                    style={{ border: '0' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Google Map"
                                ></iframe>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                initial="initial"
                                animate="animate"
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <div className="max-w-full mx-auto rounded-lg overflow-hidden shadow-lg">
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Our Address</h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">Barnala, Punjab, India</p>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hours</h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">Monday - Friday: 9am - 5pm</p>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">Saturday: 10am - 4pm</p>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">Sunday: Closed</p>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact</h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">Email: info@payzoid.vercel.app</p>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">Phone: +91 98773 34xxx</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative bottom-[30vh] max-w-full">
                <div className="absolute w-full object-contain">
                    <img src="/circle.png" alt="Circle" className="relative object-fill" />
                </div>
            </div>
        </div>
    );
}

export default Contact;