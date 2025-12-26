require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./views");

const hubspot = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  }
});


app.get("/", async (req, res) => {
  try {
    const resp = await hubspot.get(
      `/crm/v3/objects/2-54742785?properties=name,publisher,price&limit=10`
    );

    res.render("homepage", { games: resp.data.results });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Failed to load games");
  }
});


app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
  });
});


app.post("/update-cobj", async (req, res) => {
  const { name, publisher, price } = req.body;

  try {
    await hubspot.post("/crm/v3/objects/2-54742785", {
      properties: { name, publisher, price }
    });

    res.redirect("/");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Failed to create game");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
