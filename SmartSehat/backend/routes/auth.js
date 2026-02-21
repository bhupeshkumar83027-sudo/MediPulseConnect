const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const router = express.Router();

/* =========================
   PATIENT SIGNUP
========================= */
router.post("/patient/signup", async (req, res) => {
  try {
    const {
      full_name,
      email,
      username,
      phone,
      age,
      gender,
      password
    } = req.body;

    // Basic validation
    if (!full_name || !email || !username || !phone || !age || !gender || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or phone already exists
    const existingUser = await pool.query(
      "SELECT id FROM patients WHERE email = $1 OR phone = $2 OR username = $3",
      [email, phone, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email, phone, or username already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await pool.query(
      `INSERT INTO patients 
       (full_name, email,username, phone, age, gender, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [full_name, email, username, phone, age, gender, hashedPassword]
    );

    res.status(201).json({
      message: "Patient registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

/* =========================
   PATIENT LOGIN
========================= */
router.post("/patient/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let result = null;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }
    if (email.split("@")[1] == "gmail.com") {
    // Check if user exists
    result = await pool.query(
      "SELECT * FROM patients WHERE email = $1",
      [email]
    );
    }
    else{
        result = await pool.query(
            "SELECT * FROM patients WHERE username = $1",
            [email]
          );
    }
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Successful login
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

//doctor login and signup routes will be similar to patient routes, just with a different table and fields as needed
router.post("/doctors/signup", async (req, res) => {
  try {
    const {
      full_name,
      email,
      username,
      phone,
      age,
      gender,
      password
    } = req.body;

    // Basic validation
    if (!full_name || !email || !username || !phone || !age || !gender || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or phone already exists
    const existingUser = await pool.query(
      "SELECT id FROM patients WHERE email = $1 OR phone = $2 OR username = $3",
      [email, phone, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email, phone, or username already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await pool.query(
      `INSERT INTO patients 
       (full_name, email,username, phone, age, gender, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [full_name, email, username, phone, age, gender, hashedPassword]
    );

    res.status(201).json({
      message: "Patient registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

/* =========================
   dpctors LOGIN
========================= */
router.post("/doctors/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let result = null;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }
    if (email.split("@")[1] == "gmail.com") {
    // Check if user exists
    result = await pool.query(
      "SELECT * FROM patients WHERE email = $1",
      [email]
    );
    }
    else{
        result = await pool.query(
            "SELECT * FROM patients WHERE username = $1",
            [email]
          );
    }
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Successful login
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});
module.exports = router;