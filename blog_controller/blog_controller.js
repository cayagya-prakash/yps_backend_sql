
import { format } from 'date-fns';
import { pool } from '../db.js'
import { ObjectId } from "mongodb";
import path from 'path';
import fs from "fs";
import { deleteFile } from '../unility/deleteFile.js';
const collections = await pool;


export const AddBlog = async (req, res) => {
  try {
   
    const {
       posttype,
  title,
  summry,
  publishdate,
  status,
  category,
  content,
  videoLink,
    } = req.body;

    const featuredImage = req.files?.featuredImage?.[0];
    const thumbnail = req.files?.thumbnail?.[0];

    if (!posttype || !title || !summry || !publishdate || !status || !category) {
      return res.status(400).json({
        message: "Please add all required fields",
      });
    }

    const [result] = await collections.query(
      `INSERT INTO blogs 
      (posttype, title, summry, publishdate, status, category, content, videoLink, featuredImage, thumbnail) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        posttype,
        title,
        summry,
        format(publishdate, 'yyyy-MM-dd'),
        status,
        category,
        content,
        videoLink,
        featuredImage ? `/uploads/blogs/${featuredImage.filename}` : null,
        thumbnail ? `/uploads/thumbnails/${thumbnail.filename}` : null,
      ]
    );

    res.status(200).json({
      status: true,
      message: "Blog added successfully!",
      insertId: result.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {

    const [rows] = await pool.query("SELECT * FROM blogs ORDER BY id DESC");

    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    const blogs = rows.map((u, i) => ({
      id: u.id,
      posttype: u.posttype,
      title: u.title,
      summry: u.summry,
      publishdate:format(u.publishdate, 'dd-MM-yyyy'),
      status: u.status,
      category: u.category,
      featuredImage: u.featuredImage
        ? {
          name: u.featuredImage.split("/").pop(),
          url: `${BASE_URL}${u.featuredImage}`,
        }
        : null,
      content: u.content,
      videoLink: u.videoLink,
      thumbnail: u.thumbnail
        ? {
          name: u.thumbnail.split("/").pop(),
          url: `${BASE_URL}${u.thumbnail}`,
        }
        : null,
      created_at: u.created_at,
    }));

    res.status(200).json({
      status: true,
      blogs,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBlogbyId = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Get blog from SQL
    const [rows] = await pool.query(
      "SELECT * FROM blogs WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    const blog = rows[0];

    // ✅ BASE URL (Keep this!)
    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    // ✅ Image formatter (Keep this!)
    const formatImage = (imagePath) => {
      if (!imagePath) return null;

      const name = imagePath.split("/").pop();

      return {
        name,
        url: `${BASE_URL}${imagePath}`,
      };
    };

    const result = {
      ...blog,
      featuredImage: formatImage(blog.featuredImage),
      thumbnail: formatImage(blog.thumbnail),
    };

    return res.status(200).json({
      status: true,
      message: "Get Blog details successfully!",
      result,
    });

  } catch (error) {
    console.error("getBlogbyId error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};



export const UpdateBlog = async (req, res) => {
  try {
   
    const { id } = req.params;

    const {
      posttype,
      title,
      summry,
      publishdate,
      status,
      category,
      content,
      videoLink,
    } = req.body;

    const featuredImage = req.files?.featuredImage?.[0];
    const thumbnail = req.files?.thumbnail?.[0];

 const data =   await collections.query(
      `UPDATE blogs SET 
      posttype=?, title=?, summry=?, publishdate=?, status=?, 
      category=?, content=?, videoLink=?,
      featuredImage=COALESCE(?, featuredImage),
      thumbnail=COALESCE(?, thumbnail)
      WHERE id=?`,
      [
        posttype,
        title,
        summry,
        format(publishdate, 'yyyy-MM-dd'),
        status,
        category,
        content,
        videoLink,
        featuredImage ? `/uploads/blogs/${featuredImage.filename}` : null,
        thumbnail ? `/uploads/thumbnails/${thumbnail.filename}` : null,
        id,
      ]
    );

    res.status(200).json({
      status: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteblogbyid = async (req, res) => {
  try {

    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM blogs WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};


