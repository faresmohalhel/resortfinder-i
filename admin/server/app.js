const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { Query } = require("pg");
app.use(cors());
app.use(express.json());

app.get("/resorts", async (req, res) => {
  const data = await pool.query("SELECT * FROM resort WHERE active = true;");
  try {
    res.status(200).json({
      status: "success",
      data: {
        "resorts-count": data.rows.length,
        resorts: data.rows,
      },
    });
    console.log(data);
  } catch (err) {
    res.status(400).json(err.message);
    console.log(err);
  }
});

app.get("/pending-resorts", async (req, res) => {
  const data = await pool.query("SELECT * FROM resort WHERE active = false;");
  try {
    res.status(200).json({
      status: "success",
      data: {
        "resorts-count": data.rows.length,
        resorts: data.rows,
      },
    });
    console.log(data);
  } catch (err) {
    res.status(400).json(err.message);
    console.log(err);
  }
});

app.post("/resorts/:id", async (req, res) => {
  const data = await pool.query(
    `UPDATE resort SET active = true WHERE id = $1;`,
    [req.params.id]
  );

  const resorts = await pool.query(
    `SELECT * FROM resort WHERE active = false;`
  );
  try {
    res.status(200).json({
      status: "success",
      data: {
        "resorts-count": resorts.rows.length,
        resorts: resorts.rows,
      },
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.delete("/resorts/:id", async (req, res) => {
  const data = await pool.query(`DELETE FROM resort WHERE id = $1;`, [
    req.params.id,
  ]);

  const resorts = await pool.query(
    `SELECT * FROM resort WHERE active = false;`
  );

  try {
    res.status(200).json({
      status: "success",
      data: {
        "users-count": resorts.rows.length,
        resorts: resorts.rows,
      },
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  const users = await pool.query(
    `UPDATE users SET active = false WHERE id = $1;`,
    [req.params.id]
  );

  try {
    res.status(200).json({
      status: "success",
      users: {
        "users-count": users.rows.length,
        users: users.rows,
      },
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.get("/users", async (req, res) => {
  const data = await pool.query("SELECT * FROM users WHERE active = true;");

  try {
    res.status(200).json({
      status: "success",
      data: {
        "users-count": data.rows.length,
        users: data.rows,
      },
    });
    console.log(data);
  } catch (err) {
    res.status(400).json(err.message);
    console.log(err);
  }
});

app.listen(8800, () => {
  console.log("Server Started on on port 8800");
});
