import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    value: string;
    onChange: (value: string) => void;
    saveText?: string;
    loading?: boolean;
}

const Modal = ({
    title,
    isOpen,
    onClose,
    onSave,
    value,
    onChange,
    saveText = "Save",
    loading,
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md overflow-hidden rounded-xl bg-[#fff740] shadow-2xl"
            >
                <div className="relative border-b border-black/10 px-6 py-4">
                    <h2 className="text-xl font-bold text-black/80">{title}</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full p-1 text-black/60 transition-colors hover:bg-black/10 hover:text-black/80"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative p-6">
                    <div className="absolute top-0 left-0 h-full w-[3px] bg-black/10" />
                    <textarea
                        autoFocus
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Write your note..."
                        className="font-caveat h-32 w-full resize-none rounded-lg bg-white/80 p-4 text-lg leading-6 text-black/80 placeholder:text-black/40 focus:bg-white/90 focus:ring-2 focus:ring-black/20 focus:outline-none"
                    />
                </div>

                <div className="flex border-t border-black/10">
                    <button
                        onClick={onClose}
                        className="flex-1 cursor-pointer border-r border-black/10 px-6 py-3 font-semibold text-black/60 transition-colors hover:bg-black/10 hover:text-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 cursor-pointer px-6 py-3 font-semibold text-black/80 transition-colors hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loading}
                    >
                        {!loading ? saveText : "Loading..."}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Modal;
