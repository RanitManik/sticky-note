const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL as string;

export const getNotes = async () => {
    const response = await fetch(`${BACKEND_API_URL}/todos`);
    return response.json();
};

export const createNote = async (description: string) => {
    const response = await fetch(`${BACKEND_API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
    });
    return response.json();
};

export const updateNote = async (id: number, description: string) => {
    const response = await fetch(`${BACKEND_API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
    });
    return response.json();
};

export const deleteNote = async (id: number) => {
    await fetch(`${BACKEND_API_URL}/todos/${id}`, { method: "DELETE" });
};
