import { motion } from "framer-motion";

const Loader = () => {
    return (
        <div className="relative h-20 w-20">
            <motion.div
                animate={{
                    rotate: [0, 0, 180, 180, 0],
                    scale: [1, 0.8, 0.8, 1, 1],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
                className="absolute inset-0"
            >
                <div className="h-full w-full rounded-lg bg-[#fff740] shadow-lg" />
                <div className="absolute top-0 left-0 h-full w-[3px] bg-black/10" />
                <div className="absolute inset-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="mb-2 h-2 w-full rounded bg-black/10"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Loader;
