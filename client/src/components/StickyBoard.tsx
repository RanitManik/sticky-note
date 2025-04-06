import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getNotes, deleteNote, createNote, updateNote } from "@/api";
import Modal from "@/components/Modal";
import StickyNote from "@/components/StickyNote";
import { Plus } from "lucide-react";
import Loader from "@/components/Loader";

interface Note {
    id: number;
    description: string;
    position: { x: number; y: number };
    color: string;
}

const COLORS = [
    "#fff740",
    "#ff7eb9",
    "#7afcff",
    "#98ff98",
    "#ffd700",
    "#ff9999",
];
const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 200;
const GRID_GAP = 20;

const calculatePosition = (index: number, containerWidth: number) => {
    const notesPerRow = Math.floor(
        (containerWidth - GRID_GAP) / (NOTE_WIDTH + GRID_GAP),
    );
    const row = Math.floor(index / notesPerRow);
    const col = index % notesPerRow;

    return {
        x: col * (NOTE_WIDTH + GRID_GAP) + GRID_GAP,
        y: row * (NOTE_HEIGHT + GRID_GAP) + GRID_GAP,
    };
};

const StickyBoard = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [newNoteText, setNewNoteText] = useState("");
    const [actionType, setActionType] = useState<"create" | "edit" | null>(
        null,
    );
    const [containerWidth, setContainerWidth] = useState(window.innerWidth);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setContainerWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        if (!isDragging) {
            // Only recalculate positions when not dragging
            const updatedNotes = notes.map((note, index) => ({
                ...note,
                position: calculatePosition(index, containerWidth),
            }));
            setNotes(updatedNotes);
        }
    }, [containerWidth, isDragging]);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const data = await getNotes();
            const notesWithPositions = data.map((note: any, index: number) => ({
                ...note,
                position: calculatePosition(index, containerWidth),
                color:
                    note.color ||
                    COLORS[Math.floor(Math.random() * COLORS.length)],
            }));
            setNotes(notesWithPositions);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newNoteText.trim()) return;

        const position = calculatePosition(notes.length, containerWidth);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const newNote = {
            id: Date.now(),
            description: newNoteText,
            position,
            color,
        };

        setNotes((prev) => [...prev, newNote]);
        setNewNoteText("");
        setIsCreating(false);

        setIsLoading(true);
        try {
            await createNote(newNoteText);
            await fetchNotes();
        } catch (error) {
            console.error("Failed to create note:", error);
            setNotes((prev) => prev.filter((note) => note.id !== newNote.id));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!activeNote) return;

        const updatedNote = { ...activeNote };
        setNotes((prev) =>
            prev.map((note) =>
                note.id === updatedNote.id ? updatedNote : note,
            ),
        );
        setActiveNote(null);

        setIsLoading(true);
        try {
            await updateNote(updatedNote.id, updatedNote.description);
        } catch (error) {
            console.error("Failed to update note:", error);
            await fetchNotes();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const deletedNote = notes.find((note) => note.id === id);
        setNotes((prev) => prev.filter((note) => note.id !== id));

        setIsLoading(true);
        try {
            await deleteNote(id);
        } catch (error) {
            console.error("Failed to delete note:", error);
            if (deletedNote) {
                setNotes((prev) => [...prev, deletedNote]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = (
        note: Note,
        newPosition: { x: number; y: number },
    ) => {
        setIsDragging(false);

        // Update local position only
        setNotes((prev) =>
            prev.map((n) =>
                n.id === note.id ? { ...n, position: newPosition } : n,
            ),
        );
    };

    return (
        <div className="bg-grid-pattern relative min-h-screen w-full overflow-hidden p-4">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm">
                    <Loader />
                </div>
            )}

            <button
                onClick={() => {
                    setIsCreating(true);
                    setActionType("create");
                }}
                className="bg-primary fixed right-6 bottom-6 z-30 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
            >
                <Plus className="h-6 w-6 text-white" />
            </button>

            <div className="relative h-full">
                <AnimatePresence>
                    {notes.map((note) => (
                        <StickyNote
                            key={note.id}
                            note={note}
                            onEdit={() => {
                                if (!isDragging) {
                                    setActiveNote(note);
                                    setActionType("edit");
                                }
                            }}
                            onDelete={() => handleDelete(note.id)}
                            onDragStart={() => handleDragStart()}
                            onDragEnd={(position) =>
                                handleDragEnd(note, position)
                            }
                        />
                    ))}
                </AnimatePresence>
            </div>

            <Modal
                title={actionType === "create" ? "Create Note" : "Edit Note"}
                isOpen={isCreating || !!activeNote}
                onClose={() => {
                    setIsCreating(false);
                    setActiveNote(null);
                    setNewNoteText("");
                }}
                onSave={actionType === "create" ? handleCreate : handleUpdate}
                value={
                    actionType === "create"
                        ? newNoteText
                        : activeNote?.description || ""
                }
                onChange={
                    actionType === "create"
                        ? setNewNoteText
                        : (value) =>
                              setActiveNote(
                                  activeNote
                                      ? { ...activeNote, description: value }
                                      : null,
                              )
                }
                saveText={actionType === "create" ? "Create" : "Save"}
            />
        </div>
    );
};

export default StickyBoard;
