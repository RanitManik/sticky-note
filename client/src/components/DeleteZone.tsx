import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteZoneProps {
    show: boolean;
    isOverlapping: boolean;
}

const DeleteZone = ({ show, isOverlapping }: DeleteZoneProps) => {
    if (!show) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: 0,
                opacity: 1,
                scale: isOverlapping ? 1.1 : 1,
                backgroundColor: isOverlapping
                    ? "rgb(239 68 68)"
                    : "rgb(220 38 38)",
            }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-red-600 px-6 py-4 text-white backdrop-blur-sm transition-all duration-200"
        >
            <motion.div
                animate={{
                    rotate: isOverlapping ? [0, -20, 20, -20, 20, 0] : 0,
                    transition: { duration: 0.5 },
                }}
            >
                <Trash2 className="h-6 w-6" />
            </motion.div>
            <span className="font-medium">Drop here to delete</span>
        </motion.div>
    );
};

export default DeleteZone;
