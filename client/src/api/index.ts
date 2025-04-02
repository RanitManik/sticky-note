import FingerprintJS from "@fingerprintjs/fingerprintjs";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL as string;

// Function to get unique fingerprintId
const getFingerprintId = async (): Promise<string> => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
};

export const getNotes = async () => {
    const fingerprintId = await getFingerprintId();
    const response = await fetch(`${BACKEND_API_URL}/todos/${fingerprintId}`);
    return response.json();
};

export const createNote = async (description: string) => {
    const fingerprintId = await getFingerprintId();
    const response = await fetch(`${BACKEND_API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, fingerprintId }),
    });
    return response.json();
};

export const updateNote = async (id: number, description: string) => {
    const fingerprintId = await getFingerprintId();
    const response = await fetch(`${BACKEND_API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, fingerprintId }),
    });
    return response.json();
};

export const deleteNote = async (id: number) => {
    const fingerprintId = await getFingerprintId();
    await fetch(`${BACKEND_API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprintId }),
    });
};
