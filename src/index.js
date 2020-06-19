import express from "express";
import cors from "cors";
require('dotenv').config();

//create express app
const app = express();
app.use(cors());

// include middleware to enable json body parsing and nested objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route to send credit
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.status(200).send('App is running!');
})

app.post('/sendcredit', (req, res) => {
  //if not array or empty send back erroe
  if(!req.body.numbers || !Array.isArray(req.body.numbers)){
    res.status(400).json({
      error: "Array of numbers not found"
    });
    return;
  }
  //get numbers array from request body
  const numList = req.body.numbers;

  //

});

app.all("*", (req, res) => {
  res.status(404).json({
    error: "resource not found"
  });
  return;
});

app.listen(port);