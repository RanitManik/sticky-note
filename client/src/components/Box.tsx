import React, { useEffect, useState } from "react";
import StickyNote from "./StickyNote";

interface BoxProps {
    id: number;
    notes: Array<{ id: number; description: string }>;
    onDragStart: () => void;
    onDragEnd: (info: any, id: number) => void;
    onUpdate: (id: number, description: string) => void;
    reference: React.RefObject<HTMLDivElement | null>;
    onNoteDrop: (noteId: number, boxId: number) => void;
}

const Box = ({
    id,
    notes,
    reference,
    onDragStart,
    onDragEnd,
    onUpdate,
    onNoteDrop,
}: BoxProps) => {
    const [positions, setPositions] = useState<{
        [key: number]: { x: number; y: number };
    }>({});

    const colors = {
        0: "#fff740", // Yellow
        1: "#ff7eb9", // Pink
        2: "#7afcff", // Blue
        3: "#98ff98", // Green
    };

    useEffect(() => {
        const newPositions: { [key: number]: { x: number; y: number } } = {};
        notes.forEach((note) => {
            if (!positions[note.id]) {
                const boxWidth = 300; // Approximate box width
                const boxHeight = 300; // Approximate box height
                const noteWidth = 200; // Note width
                const noteHeight = 150; // Note height

                const x = Math.random() * (boxWidth - noteWidth);
                const y = Math.random() * (boxHeight - noteHeight);

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

        if (info.point.y > window.innerHeight - 100) {
            onDragEnd(info, noteId);
        }
    };

    return (
        <div className="note-box relative flex overflow-visible border-2 border-dashed border-gray-500 p-4">
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
                />
            ))}
        </div>
    );
};

export default Box;
