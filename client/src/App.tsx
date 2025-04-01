import Header from "@/components/Header.tsx";
import Background from "@/components/Background.tsx";
import StickyBoard from "@/components/StickyBoard.tsx";

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col space-y-6 bg-gray-950 p-4 text-white md:px-16 md:py-10">
            <Header />
            <Background />
            <StickyBoard />
        </main>
    );
}
