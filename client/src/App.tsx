import React from "react";
import StickyBoard from "@/components/StickyBoard";

function App() {
    const [isCreating, setIsCreating] = React.useState(false);

    return (
        <main className="flex h-[100svh] overflow-hidden bg-gray-950 p-2 md:p-4">
            <StickyBoard
                isCreating={isCreating}
                setIsCreating={setIsCreating}
            />
        </main>
    );
}

export default App;
