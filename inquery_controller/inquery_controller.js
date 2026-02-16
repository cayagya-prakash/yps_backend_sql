import { pool } from '../db.js'

export const AddInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        status: false,
        message: "Please fill required fields",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO inquiries (name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, subject, message]
    );

    res.status(200).json({
      status: true,
      message: "Inquiry added successfully!",
      insertId: result.insertId,
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
export const getAllInquiry = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM inquiries ORDER BY id DESC"
    );

    const inqs = rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      subject: u.subject,
      message: u.message,
      created_at: u.created_at,
    }));

    res.status(200).json({
      status: true,
      message: "Get Inquiry Successfully!",
      inqs,
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
