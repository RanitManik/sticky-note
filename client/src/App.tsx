import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

export default function App() {
    // Creates a new editor instance.
    const editor = useCreateBlockNote();

    const [blocks, setBlocks] = useState<Block[]>([]);

    // Renders the editor instance using a React component.
    return (
        <>
            <BlockNoteView
                editor={editor}
                onChange={() => {
                    // Saves the document JSON to state.
                    setBlocks(editor.document);
                }}
            />
        </>
    );
}
