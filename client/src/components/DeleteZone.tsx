import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteZoneProps {
    show: boolean;
}

const DeleteZone = ({ show }: DeleteZoneProps) => {
    if (!show) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-red-500 px-6 py-4 text-white backdrop-blur-sm"
        >
            <Trash2 className="h-6 w-6" />
            <span className="font-medium">Drop here to delete</span>
        </motion.div>
    );
};

export default DeleteZone;
