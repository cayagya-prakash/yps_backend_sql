import { pool } from "../db.js";

const collections = await pool
export const dashboardcount = async (req, res) => {
  try {
    // Run all counts in parallel (faster 🚀)
    const [
      [blogsCount],
      [jobsCount],
      [inquiryCount],
      [jobApplicationCount],
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total FROM blogs"),
      pool.query("SELECT COUNT(*) AS total FROM career"),
      pool.query("SELECT COUNT(*) AS total FROM inquiries"),
      pool.query("SELECT COUNT(*) AS total FROM job_applications"),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        blogs: blogsCount[0].total,
        jobs: jobsCount[0].total,
        inquiries: inquiryCount[0].total,
        jobapplications: jobApplicationCount[0].total,
      },
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
