require("dotenv").config();
const express = require("express");
const cors = require("cors");

const patientAuthRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", patientAuthRoutes);

app.get("/", (req, res) => {
  res.send("MedAI Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});