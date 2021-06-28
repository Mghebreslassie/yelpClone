const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3001;
const morgan = require("morgan");
const db = require("./db");
const cors = require("cors");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const restaurants = await db.query("SELECT * FROM restaurants;");
    res.status(200).json({
      status: "success",
      results: restaurants.rows.length,
      data: {
        restaurants: restaurants.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await db.query(
      `
      SELECT * FROM restaurants WHERE id = $1;
      `,
      [restaurantId]
    );
    res.status(200).json({
      status: "success",
      results: restaurant.rows.length,
      data: {
        restaurant: restaurant.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const { name, location, price_range } = await req.body;
    db.query(
      `INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3);`,
      [name, location, price_range]
    );
    res.status(200).json({
      status: "succesful",
    });
  } catch (error) {
    console.log(error);
  }
});
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const { name, location, price_range } = req.body.updatedInfo;
    const restaurant = await db.query(
      `UPDATE restaurants SET name = $2, location = $3, price_range = $4 WHERE id = $1`,
      [req.params.id, name, location, price_range]
    );
    res.status(200).json({
      status: "successful",
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM restaurants WHERE id = $1`, [req.params.id]);
    res.status(200).json({
      status: "successful",
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("server is up and listnening on port " + port);
});
