import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getNotes, deleteNote, createNote, updateNote } from "@/api";
import Background from "@/components/Background";
import Modal from "@/components/Modal";
import DeleteZone from "@/components/DeleteZone";
import { useOptimistic } from "react";

interface Note {
    id: number;
    description: string;
}

const StickyBoard: React.FC<{
    isCreating: boolean;
    setIsCreating: (value: boolean) => void;
}> = ({ isCreating, setIsCreating }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [showDeleteZone, setShowDeleteZone] = useState(false);
    const [newNoteText, setNewNoteText] = useState("");
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const [optimisticNotes, addOptimisticNote] = useOptimistic<Note[], Note>(
        notes,
        (state, newNote) => [...state, newNote],
    );

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const data = await getNotes();
        setNotes(data);
    };

    const handleDelete = async (id: number) => {
        try {
            const optimisticNotesList = notes.filter((note) => note.id !== id);
            setNotes(optimisticNotesList);
            await deleteNote(id);
            await fetchNotes();
        } catch (error) {
            console.error("Failed to delete note:", error);
            await fetchNotes();
        }
    };

    const handleCreate = async () => {
        if (!newNoteText.trim()) return;
        try {
            const optimisticNote = { id: Date.now(), description: newNoteText };
            addOptimisticNote(optimisticNote);
            await createNote(newNoteText);
            await fetchNotes();
            setNewNoteText("");
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to create note:", error);
            await fetchNotes();
        }
    };

    const handleUpdate = async (id: number) => {
        const note = notes.find((n) => n.id === id);
        if (note) {
            setEditingNote(note);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingNote) return;
        try {
            const optimisticNotesList = notes.map((note) =>
                note.id === editingNote.id ? editingNote : note,
            );
            setNotes(optimisticNotesList);
            await updateNote(editingNote.id, editingNote.description);
            await fetchNotes();
            setEditingNote(null);
        } catch (error) {
            console.error("Failed to update note:", error);
            await fetchNotes();
        }
    };

    const handleNoteDrop = async (noteId: number, boxId: number) => {
        const noteToUpdate = notes.find((note) => note.id === noteId);
        if (!noteToUpdate) return;

        const currentBox = noteId % 4;
        const idDifference = boxId - currentBox;
        const newId = noteId + idDifference;

        try {
            const optimisticNotesList = notes.map((note) =>
                note.id === noteId ? { ...note, id: newId } : note,
            );
            setNotes(optimisticNotesList);
            await updateNote(noteId, noteToUpdate.description);
            await fetchNotes();
        } catch (error) {
            console.error("Failed to update note position:", error);
            await fetchNotes();
        }
    };

    return (
        <div ref={ref} className="relative h-full w-full">
            <AnimatePresence>
                <Background
                    onCreateClick={() => setIsCreating(true)}
                    notes={optimisticNotes}
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

                <DeleteZone show={showDeleteZone} />

                <Modal
                    title="Create Note"
                    isOpen={isCreating}
                    onClose={() => setIsCreating(false)}
                    onSave={handleCreate}
                    value={newNoteText}
                    onChange={setNewNoteText}
                    saveText="Create"
                />

                <Modal
                    title="Edit Note"
                    isOpen={!!editingNote}
                    onClose={() => setEditingNote(null)}
                    onSave={handleSaveEdit}
                    value={editingNote?.description || ""}
                    onChange={(value) =>
                        setEditingNote(
                            editingNote
                                ? { ...editingNote, description: value }
                                : null,
                        )
                    }
                />
            </AnimatePresence>
        </div>
    );
};

export default StickyBoard;
