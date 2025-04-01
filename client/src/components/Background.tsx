import Box from "@/components/Box.tsx";
import Smile from "@/components/Smile.tsx";

const Background = () => (
    <>
        <div className="relative grid flex-grow gap-3 md:grid-cols-2 md:grid-rows-2">
            {/* Grid Sections */}
            <Box />
            <Box />
            <Box />
            <Box />

            {/* Center Smiley */}
            <div className="absolute inset-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-gray-500 bg-gray-950">
                <Smile size={36} />
            </div>
        </div>
        {/* Wrapper Div: Not will be able to select anything on the page */}
        <div className="fixed top-0 left-0 z-[3] h-full w-full"></div>
    </>
);

export default Background;
