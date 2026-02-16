
import { pool } from '../db.js'
const collections = await pool;

export const AddJobApplication = async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      mobile,
      applyfor,
      city,
      qualification,
      experience,
      status,
      portfolio,
      reason,
      expectedSalary,
      noticePeriod,
    } = req.body;

    const resume = req.file
      ? `/uploads/resume/${req.file.filename}`
      : null;

    // ✅ Validation
    if (
      !jobId ||
      !fullName ||
      !email ||
      !mobile ||
      !city ||
      !qualification ||
      !experience ||
      !status ||
      !resume ||
      !reason
    ) {
      return res.status(400).json({
        status: false,
        message: "Please fill all required fields",
      });
    }

    // ✅ Check Job Exists
    const [jobRows] = await pool.query(
      "SELECT id FROM career WHERE id = ?",
      [jobId]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    // ✅ Insert Application
    const [result] = await pool.query(
      `INSERT INTO job_applications
      (jobId, fullName, email, mobile, applyfor, city,
       qualification, experience, status, resume,
       portfolio, reason, expectedSalary, noticePeriod)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobId,
        fullName,
        email,
        mobile,
        applyfor,
        city,
        qualification,
        experience,
        status,
        resume,
        portfolio,
        reason,
        expectedSalary,
        noticePeriod,
      ]
    );

    res.status(200).json({
      status: true,
      message: "Application submitted successfully",
      applicationId: result.insertId,
    });

  } catch (error) {
    console.error("AddJobApplication Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export const GetJobApplications = async (req, res) => {
  try {
    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    const [rows] = await pool.query(`
      SELECT 
        ja.*,
        c.jobTitle,
        c.department,
        c.location
      FROM job_applications ja
      JOIN career c ON ja.jobId = c.id
      ORDER BY ja.appliedAt DESC
    `);

    const finalResult = rows.map((item, index) => ({
      id: item.id,
      serial: index + 1,
      ...item,
      resume: item.resume
        ? `${BASE_URL}${item.resume}`
        : null,
    }));

    res.status(200).json({
      status: true,
      data: finalResult,
    });

  } catch (error) {
    console.error("GetJobApplications Error:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

