import Box from "@/components/Box";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface BackgroundProps {
    onCreateClick: () => void;
    notes: Array<{ id: number; description: string }>;
    reference: React.RefObject<HTMLDivElement | null>;
    onDragStart: () => void;
    onDragEnd: (info: any, id: number) => void;
    onUpdate: (id: number, description: string) => void;
    onNoteDrop: (noteId: number, boxId: number) => void;
    deletingNoteId?: number | null;
    onDeleteZoneOverlap: (isOverlapping: boolean) => void;
}

const Background = ({
    onCreateClick,
    notes,
    reference,
    onDragStart,
    onDragEnd,
    onUpdate,
    onNoteDrop,
    deletingNoteId,
    onDeleteZoneOverlap,
}: BackgroundProps) => {
    // Distribute notes into 4 boxes
    const boxNotes = Array.from({ length: 4 }, (_, boxIndex) =>
        notes.filter((note) => note.id % 4 === boxIndex),
    );

    return (
        <>
            <div className="relative grid h-full w-full flex-grow grid-cols-2 grid-rows-2 gap-4">
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
                        deletingNoteId={deletingNoteId}
                        onDeleteZoneOverlap={onDeleteZoneOverlap}
                    />
                ))}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onCreateClick}
                    className="group absolute inset-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#fdb81e] transition-colors hover:border-[#fdb81e] hover:bg-[#fdb81e]"
                >
                    <Plus className="h-6 w-6 text-black transition-colors group-hover:text-black" />
                </motion.button>
            </div>
        </>
    );
};

export default Background;
