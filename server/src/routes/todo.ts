import express, { Request, Response } from "express";
import pool from "@/db";

const router = express.Router();

// create todos
router.post("/", async (req: Request, res: Response) => {
    try {
        const { description } = req.body;

        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description],
        );

        res.json(newTodo.rows);
    } catch (e) {
        console.error(e);
    }
});

// get all todos
router.get("/", async (req: Request, res: Response) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (e) {
        console.error(e);
    }
});

// get a todo
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
        res.json(todo.rows);
    } catch (e) {
        console.error(e);
    }
});

// update a todo
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updatedTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE  id = $2 RETURNING *",
            [description, id],
        );

        res.json(updatedTodo.rows);
    } catch (e) {
        console.error(e);
    }
});

// delete a todo
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [
            id,
        ]);

        res.json("TODO was deleted");
    } catch (e) {
        console.error(e);
    }
});

export default router;
