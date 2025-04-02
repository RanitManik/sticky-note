import React, { useEffect, useState, useRef } from "react";
import StickyNote from "./StickyNote";

interface BoxProps {
    id: number;
    notes: Array<{ id: number; description: string }>;
    onDragStart: () => void;
    onDragEnd: (info: any, id: number) => void;
    onUpdate: (id: number, description: string) => void;
    reference: React.RefObject<HTMLDivElement | null>;
    onNoteDrop: (noteId: number, boxId: number) => void;
    deletingNoteId?: number | null;
    onDeleteZoneOverlap: (isOverlapping: boolean) => void;
}

const Box = ({
    id,
    notes,
    reference,
    onDragStart,
    onDragEnd,
    onUpdate,
    onNoteDrop,
    deletingNoteId,
    onDeleteZoneOverlap,
}: BoxProps) => {
    const [positions, setPositions] = useState<{
        [key: number]: { x: number; y: number };
    }>({});
    const boxRef = useRef<HTMLDivElement>(null);

    const colors = {
        0: "#fff740", // Yellow
        1: "#ff7eb9", // Pink
        2: "#7afcff", // Blue
        3: "#98ff98", // Green
    };

    useEffect(() => {
        if (!boxRef.current) return;

        const boxElement = boxRef.current;
        const newPositions: { [key: number]: { x: number; y: number } } = {};

        // Get actual box dimensions minus padding
        const boxRect = boxElement.getBoundingClientRect();
        const boxPadding = 16; // 16px padding (p-4)
        const boxWidth = boxRect.width - boxPadding * 2;
        const boxHeight = boxRect.height - boxPadding * 2;

        // Note dimensions
        const noteWidth = 200;
        const noteHeight = 150;

        notes.forEach((note) => {
            if (!positions[note.id]) {
                // Calculate maximum possible positions
                const maxX = Math.max(0, boxWidth - noteWidth);
                const maxY = Math.max(0, boxHeight - noteHeight);

                // Use grid-based positioning with slight randomness
                const noteIndex = notes.findIndex((n) => n.id === note.id);
                const gridCols = Math.min(
                    3,
                    Math.ceil(Math.sqrt(notes.length)),
                );
                const col = noteIndex % gridCols;
                const row = Math.floor(noteIndex / gridCols);

                // Calculate base position
                const baseX = (maxX / Math.max(1, gridCols - 1)) * col;
                const baseY =
                    (maxY /
                        Math.max(1, Math.ceil(notes.length / gridCols) - 1)) *
                    row;

                // Add slight randomness
                const x = Math.max(
                    0,
                    Math.min(maxX, baseX + (Math.random() * 40 - 20)),
                );
                const y = Math.max(
                    0,
                    Math.min(maxY, baseY + (Math.random() * 40 - 20)),
                );

                newPositions[note.id] = { x, y };
            }
        });

        setPositions((prev) => ({ ...prev, ...newPositions }));
    }, [notes]);

    const handleDragEnd = (event: any, info: any, noteId: number) => {
        const element = event.target;
        const boxes = document.querySelectorAll(".note-box");
        const elementRect = element.getBoundingClientRect();
        const centerX = elementRect.x + elementRect.width / 2;
        const centerY = elementRect.y + elementRect.height / 2;

        // Check if note is over delete zone
        const deleteZoneY = window.innerHeight - 100;
        const isOverDeleteZone = centerY > deleteZoneY;
        onDeleteZoneOverlap(isOverDeleteZone);

        let droppedInBox = false;

        boxes.forEach((box, index) => {
            const boxRect = box.getBoundingClientRect();
            if (
                centerX >= boxRect.left &&
                centerX <= boxRect.right &&
                centerY >= boxRect.top &&
                centerY <= boxRect.bottom &&
                !isOverDeleteZone
            ) {
                onNoteDrop(noteId, index);
                droppedInBox = true;
                return;
            }
        });

        if (!droppedInBox && isOverDeleteZone) {
            onDragEnd(info, noteId);
        } else if (!droppedInBox) {
            // If not dropped in any box or delete zone, return to original position
            setPositions((prev) => ({
                ...prev,
                [noteId]: prev[noteId] || { x: 0, y: 0 },
            }));
        }
    };

    return (
        <div
            ref={boxRef}
            className="note-box relative flex overflow-visible border-2 border-dashed border-gray-500 p-4"
        >
            {notes.map((note) => (
                <StickyNote
                    key={note.id}
                    id={note.id}
                    description={note.description}
                    color={colors[id as keyof typeof colors]}
                    position={positions[note.id] || { x: 0, y: 0 }}
                    reference={reference}
                    onDragStart={onDragStart}
                    onDragEnd={handleDragEnd}
                    onUpdate={onUpdate}
                    isBeingDeleted={deletingNoteId === note.id}
                />
            ))}
        </div>
    );
};

export default Box;
