import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import * as React from "react";

interface StickyNoteProps {
    id: number;
    data: string;
    reference: React.RefObject<null>;
    onDragStart?: () => void;
    onDragEnd?: (info: PanInfo, id: number) => void;
    onUpdate?: (id: number, description: string) => void;
}

const StickyNote = ({
    id,
    data,
    reference,
    onDragStart,
    onDragEnd,
    onUpdate,
}: StickyNoteProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(data);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(text.length, text.length);
        }
    }, [isEditing]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (text !== data && onUpdate) {
            onUpdate(id, text);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            dragConstraints={reference}
            drag={!isEditing}
            onDragStart={onDragStart}
            onDragEnd={(_, info) => onDragEnd?.(info, id)}
            style={{ cursor: isEditing ? "default" : "grab" }}
            whileDrag={{
                cursor: "grabbing",
                scale: 1.2,
                zIndex: 50,
            }}
            className="absolute h-42 w-42 space-y-3 bg-[#fdb81e] px-3 py-6 text-black shadow-sm select-none"
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleBlur}
                    className="font-winky h-full w-full resize-none bg-transparent text-xl tracking-tighter focus:outline-none"
                />
            ) : (
                <p className="font-winky line-clamp-4 text-xl tracking-tighter">
                    {text}
                </p>
            )}
        </motion.div>
    );
};

export default StickyNote;
