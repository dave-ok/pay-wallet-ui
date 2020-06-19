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

app.post('/buyairtime', async (req, res) => {
  //if not array or empty send back erroe
  if(!req.body.numbers || !Array.isArray(req.body.numbers)){
    res.status(400).json({
      error: "Array of numbers not found"
    });
    return;
  }
  //get numbers array from request body
  const numList = req.body.numbers;
  const options = {
    method: "POST",
    uri: "https://api.wallets.africa/bills/airtime/purchase",
    json: true
  }

  const responseMessages = []; //initialize array for responses

  //iterate through numbers
  for(const numRecord of numList) {
    //send request to paywallet
    console.log(numRecord);
    let phoneNumber, code, amount;
   
    try {
      ({ phoneNumber, code, amount } = numRecord);
      options.body = {
        PhoneNumber: phoneNumber,
        Code: code,
        Amount: amount,
        SecretKey: process.env.SECRET_KEY
      }

      const response = await request.post(options).auth(null, null, true, process.env.PUBLIC_KEY);
      console.log(response);

      // push response into array of responseMesssages
      responseMessages.push({
        phoneNumber,
        amount,
        message: response
      });

      // console.log(responseMessages);

    } catch (error) {
      responseMessages.push({
        phoneNumber,
        amount,
        error: error.error.Message
      });

      // console.log(responseMessages);
    }   
    
  };

  res.status(200).json(responseMessages);

});

app.all("*", (req, res) => {
  res.status(404).json({
    error: "resource not found"
  });
  return;
});

app.listen(port);
console.log(`App listening on port ${port}`);