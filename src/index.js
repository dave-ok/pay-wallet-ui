import express from "express";
import cors from "cors";

require('dotenv').config();
const request = require('request-promise');

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
});

app.get("/providers", async (req, res) => {
  const options = {
    method: "POST",
    uri: "https://api.wallets.africa/bills/airtime/providers",
    json: true
  }
  try {
    const response = await request.post(options).auth(null, null, true, process.env.PUBLIC_KEY);
    console.log(response);
    res.status(200).send(response.Providers);
  } catch (error) {
    res.status(400).send("An error occured getting providers");
  }
  
  
});

app.post('/sendairtime', (req, res) => {
  //if not array or empty send back erroe
  if(!req.body.numbers || !Array.isArray(req.body.numbers)){
    res.status(400).json({
      error: "Array of numbers not found"
    });
    return;
  }
  //get numbers array from request body
  const numList = req.body.numbers;

  //iterate through numbers
  numList.forEach(numRecord => {
    //send request to paywallet
    
  });

});

app.all("*", (req, res) => {
  res.status(404).json({
    error: "resource not found"
  });
  return;
});

app.listen(port);
console.log(`App listening on port ${port}`);