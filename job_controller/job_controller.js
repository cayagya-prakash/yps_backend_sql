import { format } from 'date-fns';
import { pool } from '../db.js'
import { ObjectId } from "mongodb";
const collections = await pool;


export const AddJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobType,
      department,
      location,
      workMode,
      experience,
      qualification,
      jobDescription,
      keyResponsibilities,
      requiredSkills,
      preferredSkills,
      salaryRange,
      openings,
      deadline,
      status,
    } = req.body;

    if (
      !jobTitle || !jobType || !department || !location ||
      !workMode || !experience || !qualification ||
      !jobDescription || !openings || !deadline || !status
    ) {
      return res.status(400).json({
        message: "Please add all required fields",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO career 
      (jobTitle, jobType, department, location, workMode, experience,
       qualification, jobDescription, keyResponsibilities, requiredSkills,
       preferredSkills, salaryRange, openings, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobTitle,
        jobType,
        department,
        location,
        workMode,
        experience,
        qualification,
        jobDescription,
        keyResponsibilities,
        requiredSkills,
        preferredSkills,
        salaryRange,
        openings,
        deadline,
        status,
      ]
    );

    res.status(200).json({
      status: true,
      message: "Job added successfully!",
      insertId: result.insertId,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM career ORDER BY id DESC");

    const jobs = rows.map((j) => ({
      id: j.id,
      ...j,
      deadline: format(new Date(j.deadline), "dd-MM-yyyy"),
    }));

    res.status(200).json({
      status: true,
      jobs,
    });

  } catch (error) {
    console.log(error);
  }
};


export const getJobbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM career WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      status: true,
      job: rows[0],
    });

  } catch (error) {
    console.log(error);
  }
};


export const UpdateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      jobTitle,
      jobType,
      department,
      location,
      workMode,
      experience,
      qualification,
      jobDescription,
      keyResponsibilities,
      requiredSkills,
      preferredSkills,
      salaryRange,
      openings,
      deadline,
      status,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE career SET 
      jobTitle=?, jobType=?, department=?, location=?, workMode=?,
      experience=?, qualification=?, jobDescription=?, keyResponsibilities=?,
      requiredSkills=?, preferredSkills=?, salaryRange=?, openings=?,
      deadline=?, status=?
      WHERE id=?`,
      [
        jobTitle,
        jobType,
        department,
        location,
        workMode,
        experience,
        qualification,
        jobDescription,
        keyResponsibilities,
        requiredSkills,
        preferredSkills,
        salaryRange,
        openings,
        deadline,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Job updated successfully!",
    });

  } catch (error) {
    console.log(error);
  }
};


export const Delete = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM career WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Job deleted successfully!",
    });

  } catch (error) {
    console.log(error);
  }
};
