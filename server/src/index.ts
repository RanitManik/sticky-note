import express from "express";
import cors from "cors";
import "dotenv/config";
import todoRoutes from "./routes/todo.js";

const app = express();

// middlewares
app.use(
    cors({
        origin: process.env.FRONTEND_URL, // Allow frontend to access
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

app.use("/todos", todoRoutes);

app.listen(4000, () => {
    console.log("Server started on port 4000");
});
