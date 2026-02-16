import { pool } from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔹 Find user by email
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [email]
        );
        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        const user = rows[0];
        // 🔹 Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        // 🔹 Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, // SQL uses id not _id
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const Forgetpsd = async (req, res) => {
    const { email, password } = req.body;

    try {

        // 🔹 Check if user exists
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        // 🔹 Hash new password
        const hashpsd = await bcrypt.hash(password, 10);

        // 🔹 Update password
        const [updatedata] = await connection.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashpsd, email]
        );

        res.status(200).json({
            status: true,
            message: "Password updated successfully!",
            updatedata,
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
