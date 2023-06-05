import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Ipopyou9$",
  port: 5432,
});
//resort
app.get("/", (req, res) => {
  res.json("hello this is the backend");
});
app.get("/resortcard", (req, res) => {
  const q = "SELECT * FROM resort";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/resortcard", (req, res) => {
  const q = "INSERT INTO resort (title,desc,price,cover) VALUES (?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("resort has been created successfully");
  });
});

app.delete("/resortcard/:id", (req, res) => {
  const resortid = req.params.id;
  const q = "DELETE FROM resort WHERE id = ?";
  db.query(q, [resortid], (err, data) => {
    if (err) return res.json(err);
    return res.json("resort has been deleted successfully");
  });
});

app.put("/resortcard/:id", (req, res) => {
  const resortid = req.params.id;
  const q =
    "UPDATE resort SET title=?, desc=? , price=? , cover=? WHERE id = ?";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];
  db.query(q, [...values, resortid], (err, data) => {
    if (err) return res.json(err);
    return res.json("resort has been updated successfully");
  });
});

//payment
app.post("/payment", async (req, res) => {
  console.log(req.body);
  try {
    // const cardnumber = req.body.cardnumber;
    const expirationdate = req.body.expirationdate;
    const cvv = req.body.cvv;

    const cardholder = req.body.cardholder;
    // const hashedCardNumber = bcrypt.hashSync(cardnumber, 10);

    const newPayment = await pool.query(
      "INSERT INTO payment ( expirationdate,cvv, cardholder) VALUES($1, $2, $3) RETURNING *",
      [expirationdate, cvv, cardholder]
    );

    res.json(newPayment.rows);
  } catch (err) {
    console.log(err.message);
  }
});
//Get all Resorts
app.get("/resorts", async (req, res) => {
  try {
    const query = "SELECT * FROM resort";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific resort by ID
app.get("/resorts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM resort WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resort not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update resort availability after booking
app.put("/payment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "UPDATE resort SET availability = false WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Resort not found" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////////////////////  fares

app.get("/resorts", async (req, res) => {
  const data = await pool.query("SELECT * FROM resort WHERE active = true;");
  try {
    res.status(200).json({
      message: "success",
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
      message: "success",
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
      message: "success",
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
      message: "success",
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
      message: "success",
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
      message: "success",
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

/////////////////////////////////////////////////////////////////////////
const port = 5000;

app.listen(port, () => {
  console.log("server work on port 5001");
});
