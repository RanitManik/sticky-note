import { motion } from "framer-motion";
import React from "react";

interface StickyNoteProps {
    id: number;
    description: string;
    color: string;
    position: { x: number; y: number };
    reference: React.RefObject<HTMLDivElement | null>;
    onDragStart: () => void;
    onDragEnd: (
        event: globalThis.MouseEvent | TouchEvent | PointerEvent,
        info: any,
        id: number,
    ) => void;
    onUpdate: (id: number, description: string) => void;
}

const StickyNote = ({
    id,
    description,
    color,
    position,
    reference,
    onDragStart,
    onDragEnd,
    onUpdate,
}: StickyNoteProps) => {
    return (
        <motion.div
            key={id}
            layout
            initial={{
                opacity: 0,
                scale: 0.8,
                x: position.x,
                y: position.y,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                x: position.x,
                y: position.y,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            dragConstraints={reference}
            drag
            onDragStart={onDragStart}
            onDragEnd={(event, info) => onDragEnd(event, info, id)}
            whileDrag={{
                cursor: "grabbing",
                scale: 1.2,
                zIndex: 50,
            }}
            onDoubleClick={() => onUpdate(id, description)}
            className="absolute h-[150px] w-[200px] cursor-grab space-y-3 px-3 py-6 text-black shadow-xl select-none"
            style={{ backgroundColor: color }}
        >
            <p className="line-clamp-4 text-xl tracking-tighter font-winky">
                {description}
            </p>
        </motion.div>
    );
};

export default StickyNote;
