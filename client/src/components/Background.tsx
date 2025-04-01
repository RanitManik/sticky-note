import Box from "@/components/Box.tsx";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface BackgroundProps {
    onCreateClick: () => void;
    notes: Array<{ id: number; description: string }>;
    reference: React.RefObject<null>;
    onDragStart: () => void;
    onDragEnd: (info: any, id: number) => void;
    onUpdate: (id: number, description: string) => void;
    onNoteDrop: (noteId: number, boxId: number) => void;
}

const Background = ({
    onCreateClick,
    notes,
    reference,
    onDragStart,
    onDragEnd,
    onUpdate,
    onNoteDrop,
}: BackgroundProps) => {
    // Distribute notes into 4 boxes based on modulo of their IDs
    const boxNotes = Array.from({ length: 4 }, (_, boxIndex) =>
        notes.filter((note) => note.id % 4 === boxIndex),
    );

    return (
        <>
            <div className="relative grid flex-grow gap-3 md:grid-cols-2 md:grid-rows-2">
                {boxNotes.map((notes, index) => (
                    <Box
                        key={index}
                        id={index}
                        notes={notes}
                        reference={reference}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onUpdate={onUpdate}
                        onNoteDrop={onNoteDrop}
                    />
                ))}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onCreateClick}
                    className="group absolute inset-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-gray-500 bg-gray-950 transition-colors hover:border-[#fdb81e] hover:bg-[#fdb81e]"
                >
                    <Plus className="h-6 w-6 text-gray-500 transition-colors group-hover:text-black" />
                </motion.button>
            </div>
        </>
    );
};

export default Background;
