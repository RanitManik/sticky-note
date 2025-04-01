import { motion } from "framer-motion";
import React from "react";

interface BoxProps {
    id: number;
    notes: Array<{ id: number; description: string }>;
    onDragStart: () => void;
    onDragEnd: (info: any, id: number) => void;
    onUpdate: (id: number, description: string) => void;
    reference: React.RefObject<null>;
    onNoteDrop: (noteId: number, boxId: number) => void;
}

const Box = ({
    id,
    notes,
    reference,
    onDragStart,
    onDragEnd,
    onNoteDrop,
}: BoxProps) => {
    const colors = {
        0: "#fff740", // Yellow
        1: "#ff7eb9", // Pink
        2: "#7afcff", // Blue
        3: "#98ff98", // Green
    };

    const handleDragEnd = (event: any, info: any, noteId: number) => {
        const element = event.target;
        const boxes = document.querySelectorAll(".note-box");
        const elementRect = element.getBoundingClientRect();
        const centerX = elementRect.x + elementRect.width / 2;
        const centerY = elementRect.y + elementRect.height / 2;

        boxes.forEach((box, index) => {
            const boxRect = box.getBoundingClientRect();
            if (
                centerX >= boxRect.left &&
                centerX <= boxRect.right &&
                centerY >= boxRect.top &&
                centerY <= boxRect.bottom
            ) {
                onNoteDrop(noteId, index);
                return;
            }
        });

        // If not dropped in any box, check if it should be deleted
        if (info.point.y > window.innerHeight - 100) {
            onDragEnd(info, noteId);
        }
    };

    return (
        <div className="note-box relative flex h-[300px] overflow-visible border-2 border-dashed border-gray-500 p-4">
            {notes.map((note) => (
                <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    dragConstraints={reference}
                    drag
                    onDragStart={onDragStart}
                    onDragEnd={(event, info) =>
                        handleDragEnd(event, info, note.id)
                    }
                    whileDrag={{
                        cursor: "grabbing",
                        scale: 1.2,
                        zIndex: 50,
                    }}
                    className="absolute w-[150px] cursor-grab space-y-3 px-3 py-6 text-black shadow-sm select-none"
                    style={{
                        backgroundColor: colors[id as keyof typeof colors],
                    }}
                >
                    <p className="font-winky line-clamp-4 text-xl tracking-tighter">
                        {note.description}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export default Box;
