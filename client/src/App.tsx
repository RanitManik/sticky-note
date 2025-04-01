import React from "react";
import Header from "@/components/Header";
import StickyBoard from "@/components/StickyBoard";

function App() {
    const [isCreating, setIsCreating] = React.useState(false);

    return (
        <main className="flex min-h-screen flex-col space-y-6 bg-gray-950 p-4 text-white md:px-16 md:py-10">
            <Header />
            <StickyBoard
                isCreating={isCreating}
                setIsCreating={setIsCreating}
            />
        </main>
    );
}

export default App;
