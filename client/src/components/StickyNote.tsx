import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

interface Note {
    id: number;
    description: string;
    position: { x: number; y: number };
    color: string;
}

interface StickyNoteProps {
    note: Note;
    onEdit: () => void;
    onDelete: () => void;
    onDragStart: () => void;
    onDragEnd: (position: { x: number; y: number }) => void;
}

const StickyNote = ({
    note,
    onEdit,
    onDelete,
    onDragStart,
    onDragEnd,
}: StickyNoteProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8, ...note.position }}
            animate={{
                opacity: 1,
                scale: 1,
                x: note.position.x,
                y: note.position.y,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            onDragStart={onDragStart}
            onDragEnd={(_, info) => {
                onDragEnd({
                    x: note.position.x + info.offset.x,
                    y: note.position.y + info.offset.y,
                });
            }}
            className="absolute flex h-[200px] w-[200px] cursor-grab flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
            style={{ backgroundColor: note.color }}
        >
            <div className="relative flex-1 p-4 before:pointer-events-none before:absolute before:inset-4 before:bg-[linear-gradient(transparent_calc(1.5rem-1px),#00000030_calc(1.5rem),transparent_calc(1.5rem+1px))] before:bg-[size:100%_1.5rem] before:content-['']">
                <div className="absolute top-0 left-0 h-full w-[3px] bg-black/10" />
                <p className="font-caveat relative line-clamp-5 text-lg leading-6 break-all">
                    {note.description}
                </p>
            </div>

            <div className="flex border-t border-black/30">
                <button
                    onClick={onEdit}
                    className="flex flex-1 cursor-pointer items-center justify-center border-r border-black/30 p-2 transition-colors hover:bg-black/20"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="flex flex-1 cursor-pointer items-center justify-center p-2 transition-colors hover:bg-black/20"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default StickyNote;
