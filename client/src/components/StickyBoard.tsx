import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getNotes, deleteNote, createNote, updateNote } from "@/api";
import Modal from "@/components/Modal";
import StickyNote from "@/components/StickyNote";
import { Plus } from "lucide-react";
import Loader from "@/components/Loader";
import ServerBootNotice from "@/components/ServerBootNotice";

interface Note {
    id: number;
    description: string;
    position: { x: number; y: number };
    color: string;
}

// Function to generate color based on first character
const getColorFromText = (text: string): string => {
    const colors = {
        a: "#ff7eb9", // Pink
        b: "#7afcff", // Cyan
        c: "#98ff98", // Light green
        d: "#ffd700", // Gold
        e: "#ff9999", // Lightc red
        f: "#fff740", // Yellow
        g: "#87CEEB", // Sky blue
        h: "#DDA0DD", // Plum
        i: "#90EE90", // Light green
        j: "#FFB6C1", // Light pink
        k: "#E6E6FA", // Lavender
        l: "#FFA07A", // Light salmon
        m: "#98FB98", // Pale green
        n: "#DEB887", // Burlywood
        o: "#F0E68C", // Khaki
        p: "#E0FFFF", // Light cyan
        q: "#FFDAB9", // Peach puff
        r: "#B0E0E6", // Powder blue
        s: "#FFE4E1", // Misty rose
        t: "#F5DEB3", // Wheat
        u: "#F0FFF0", // Honeydew
        v: "#F5F5DC", // Beige
        w: "#FFF0F5", // Lavender blush
        x: "#F0FFFF", // Azure
        y: "#FFFACD", // Lemon chiffon
        z: "#F5F5F5", // White smoke
    };

    const firstChar = text.trim().toLowerCase().charAt(0);
    return colors[firstChar as keyof typeof colors] || "#fff740"; // Default to yellow if no match
};

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
    const [showServerNotice, setShowServerNotice] = useState(false);
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

        // Show server notice after 10 seconds of loading
        const timer = setTimeout(() => {
            if (isLoading) {
                setShowServerNotice(true);
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isDragging) {
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
                color: getColorFromText(note.description),
            }));
            setNotes(notesWithPositions);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setIsLoading(false);
            setShowServerNotice(false);
        }
    };

    const handleCreate = async () => {
        if (!newNoteText.trim()) return;

        const position = calculatePosition(notes.length, containerWidth);
        const color = getColorFromText(newNoteText);
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

        const updatedNote = {
            ...activeNote,
            color: getColorFromText(activeNote.description),
        };

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
        setNotes((prev) =>
            prev.map((n) =>
                n.id === note.id ? { ...n, position: newPosition } : n,
            ),
        );
    };

    if (showServerNotice) {
        return <ServerBootNotice />;
    }

    return (
        <div className="bg-grid-pattern relative min-h-screen w-full overflow-hidden p-4">
            {isLoading && !showServerNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
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
                <Plus className="h-6 w-6 text-black" />
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
