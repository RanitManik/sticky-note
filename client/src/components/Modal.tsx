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
}

const Modal = ({
    title,
    isOpen,
    onClose,
    onSave,
    value,
    onChange,
    saveText = "Save",
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md rounded-lg bg-[#fdb81e] p-6 shadow"
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-black">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <textarea
                    autoFocus
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Write your note..."
                    className="h-32 w-full resize-none rounded bg-white/90 p-3 text-black focus:outline-none"
                />
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded bg-gray-200 px-4 py-2 text-black transition-colors hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-900"
                    >
                        {saveText}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Modal;
