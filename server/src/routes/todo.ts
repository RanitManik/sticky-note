import express, { Request, Response } from "express";
import pool from "../db.js";

const router = express.Router();

// @ts-ignore
router.post("/", async (req: Request, res: Response) => {
    try {
        const { description, fingerprintId } = req.body;
        if (!fingerprintId || !description) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newTodo = await pool.query(
            "INSERT INTO todo (description, fingerprintId) VALUES ($1, $2) RETURNING *",
            [description, fingerprintId],
        );

        return res.status(201).json(newTodo.rows[0]);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// @ts-ignore
router.get("/:fingerprintId", async (req: Request, res: Response) => {
    try {
        const { fingerprintId } = req.params;
        const userTodos = await pool.query(
            "SELECT * FROM todo WHERE fingerprintId = $1",
            [fingerprintId],
        );

        return res.status(200).json(userTodos.rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// @ts-ignore
router.get("/:fingerprintId/:id", async (req: Request, res: Response) => {
    try {
        const { fingerprintId, id } = req.params;
        const todo = await pool.query(
            "SELECT * FROM todo WHERE id = $1 AND fingerprintId = $2",
            [id, fingerprintId],
        );

        if (todo.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        return res.status(200).json(todo.rows[0]);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// @ts-ignore
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description, fingerprintId } = req.body;

        if (!description || !fingerprintId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const updatedTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE id = $2 AND fingerprintId = $3 RETURNING *",
            [description, id, fingerprintId],
        );

        if (updatedTodo.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Todo not found or not authorized" });
        }

        return res.status(200).json(updatedTodo.rows[0]);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// @ts-ignore
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fingerprintId } = req.body;

        if (!fingerprintId) {
            return res.status(400).json({ error: "Missing fingerprint ID" });
        }

        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE id = $1 AND fingerprintId = $2 RETURNING *",
            [id, fingerprintId],
        );

        if (deleteTodo.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Todo not found or not authorized" });
        }

        return res.status(200).json({ message: "Todo was deleted" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
