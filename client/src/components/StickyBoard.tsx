import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { getNotes, deleteNote, createNote, updateNote } from "@/api";
import Background from "./Background";

interface Note {
    id: number;
    description: string;
}

const StickyBoard: React.FC<{
    isCreating: boolean;
    setIsCreating: (value: boolean) => void;
}> = ({ isCreating, setIsCreating }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [showDeleteZone, setShowDeleteZone] = useState(false);
    const [newNoteText, setNewNoteText] = useState("");

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

    const handleNoteDrop = async (noteId: number, boxId: number) => {
        // Update the note's ID to match the new box
        const noteToUpdate = notes.find((note) => note.id === noteId);
        if (!noteToUpdate) return;

        // Calculate the new ID to ensure it belongs to the target box
        const currentBox = noteId % 4;
        const idDifference = boxId - currentBox;
        const newId = noteId + idDifference;

        try {
            // Update the note with the new ID
            await updateNote(noteId, noteToUpdate.description);
            setNotes(
                notes.map((note) =>
                    note.id === noteId ? { ...note, id: newId } : note,
                ),
            );
        } catch (error) {
            console.error("Failed to update note position:", error);
        }
    };

    return (
        <div ref={ref} className="relative flex-grow">
            <Background
                onCreateClick={() => setIsCreating(true)}
                notes={notes}
                reference={ref}
                onDragStart={() => setShowDeleteZone(true)}
                onDragEnd={(info, id) => {
                    setShowDeleteZone(false);
                    if (info.point.y > window.innerHeight - 100) {
                        handleDelete(id);
                    }
                }}
                onUpdate={handleUpdate}
                onNoteDrop={handleNoteDrop}
            />

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{
                    y: showDeleteZone ? 0 : 100,
                    opacity: showDeleteZone ? 1 : 0,
                }}
                className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-red-500 px-6 py-4 backdrop-blur-sm"
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
                        className="w-full max-w-md rounded-lg bg-[#fdb81e] p-6 shadow-xl"
                    >
                        <textarea
                            autoFocus
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            placeholder="Write your note..."
                            className="h-32 w-full resize-none rounded bg-white/90 p-3 text-black focus:outline-none"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="rounded bg-gray-200 px-4 py-2 text-black transition-colors hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-900"
                            >
                                Create
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StickyBoard;
