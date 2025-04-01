import StickyNote from "@/components/StickyNote.tsx";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import { getNotes, deleteNote, createNote, updateNote } from "@/api";

interface Note {
    id: number;
    description: string;
}

const StickyBoard = () => {
    const ref = useRef(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [showDeleteZone, setShowDeleteZone] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newNoteText, setNewNoteText] = useState("");

    console.log(notes);

    useEffect(() => {
        const fetchNotes = async () => {
            const data = await getNotes();
            setNotes(data);
        };
        fetchNotes();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteNote(id);
            setNotes(notes.filter((note) => note.id !== id));
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

    const handleCreate = async () => {
        if (!newNoteText.trim()) return;
        try {
            const newNote = await createNote(newNoteText);
            setNotes([...notes, newNote]);
            setNewNoteText("");
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to create note:", error);
        }
    };

    const handleUpdate = async (id: number, description: string) => {
        try {
            await updateNote(id, description);
            setNotes(
                notes.map((note) =>
                    note.id === id ? { ...note, description } : note,
                ),
            );
        } catch (error) {
            console.error("Failed to update note:", error);
        }
    };

    return (
        <>
            <div ref={ref} className="fixed top-0 left-0 z-[3] h-full w-full">
                {notes.map((note) => (
                    <StickyNote
                        key={note.id}
                        id={note.id}
                        data={note.description}
                        reference={ref}
                        onDragStart={() => setShowDeleteZone(true)}
                        onDragEnd={(info, id) => {
                            setShowDeleteZone(false);
                            if (info.point.y > window.innerHeight - 100) {
                                handleDelete(id);
                            }
                        }}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCreating(true)}
                className="fixed top-8 right-8 z-50 rounded-full bg-[#fdb81e] p-3 shadow-lg"
            >
                <Plus className="h-6 w-6 text-black" />
            </motion.button>

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{
                    y: showDeleteZone ? 0 : 100,
                    opacity: showDeleteZone ? 1 : 0,
                }}
                className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-red-500 px-6 py-4 backdrop-blur-sm"
            >
                <Trash2 className="h-6 w-6" />
                <span className="font-medium text-white">
                    Drop here to delete
                </span>
            </motion.div>

            {isCreating && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-md  bg-[#fdb81e] p-6 shadow-xl"
                    >
                        <textarea
                            autoFocus
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            placeholder="Write your note..."
                            className="h-32 w-full resize-none  bg-white/90 p-3 text-black focus:outline-none"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setIsCreating(false)}
                                className=" bg-gray-200 px-4 py-2 text-black transition-colors hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className=" bg-black px-4 py-2 text-white transition-colors hover:bg-gray-900"
                            >
                                Create
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default StickyBoard;
