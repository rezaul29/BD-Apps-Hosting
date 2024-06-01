const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const BASE_URL = "https://developer.bdapps.com"
const APP_ID = "APP_118891";
const APP_HASH = "bal"
const APP_PASS ="14ca866624387c7f315aa627f6760438"
const NUM_EXT = "tel:88"
const META_DATA = {
  client: "MOBILEAPP",
  device: "Samsung S10",
  os: "android 8",
  appCode: "https://play.google.com/store/apps/details?id=lk"
}

app.use(express.json());

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello, World bal app ');
});


// Check if a user is subscribed or not
app.post('/check-subscription', async (req, res) => {
    try {
      const {number} = req.body;
      
  
     // Check if all required fields are present
      if (!number) {
        throw new Error('Missing required fields in the request body');
      }

      console.log(NUM_EXT+number );
  
      // Make a POST request to check subscription status
      const response = await axios.post(BASE_URL+'/subscription/getStatus', {
        applicationId: APP_ID,
        password: APP_PASS,
        subscriberId: NUM_EXT+number 
      } ,  {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });

      
       
  
      // Check if the request was successful
      if (response.status === 200) {
        // Send response with subscription status
        res.status(200).json({
          version: response.data.version,
          statusCode: response.data.statusCode,
          statusDetail: response.data.statusDetail,
          subscriptionStatus: response.data.subscriptionStatus
        });
      } else {
        throw new Error('Failed to check subscription status');
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  

//Subscribe a User
app.post('/subscribe', async (req, res) => {

  //console.log(req.headers);
  // console.log(req.url);
  // console.log(typeof(req.body));
  // console.log(req.body);

    try {
       const number  = req.query.number;
      
      console.log(number)



      // console.log(a +"\n" +" kala Fahad");

      console.log(req.query.number +" rq")
      

        // Make a POST request to bdapps.com/sub
        const response = await axios.post(BASE_URL+'/subscription/otp/request/', {
          applicationId: APP_ID,
          password: APP_PASS,
          subscriberId: NUM_EXT+number,
          applicationHash: APP_HASH,
          applicationMetaData: META_DATA
        } ,  {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        });

      //  console.log(response.body);

        // Check if the request was successful
        if (response.status === 200) {
          // Extract referenceNo from the response
          const { referenceNo } = response.data;
  
          // Send response with referenceNo
          res.status(200).json({
            statusCode: response.data.statusCode,
            referenceNo,
            statusDetail: response.data.statusDetail,
            applicationMetaData: META_DATA
          });
        } else {
          throw new Error('Failed to send data to bdapps.com/sub');
        }
       
    } catch (error) {
      res.status(400).send(error.message);
    }
  });





  //  Verify Subscription
app.post('/confirm_subscription', async (req, res) => {
    try {
      const {referenceNo, otp} = req.body;
  
      // Check if all required fields are present and non-empty strings
      if (!referenceNo || !otp) {
        throw new Error('Invalid request body');
      }
  
      // Make a POST request to verify OTP
      const response = await axios.post(BASE_URL+'/subscription/otp/verify', {
        applicationId: APP_ID,
        password: APP_PASS,
        referenceNo,
        otp
      });
  
      // Check if the request was successful
      if (response.status === 200) {
        res.send('OTP verified successfully');
      } else {
        throw new Error('Failed to verify OTP');
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  




//BroadCast SMS
app.post('/send-sms', async (req, res) => {
  const payload = {
    applicationId: APP_ID,
    password: APP_PASS,
    message: "Sample Message",
    destinationAddresses: ["tel:8801812345678"]
  };

  try {
      const response = await axios.post(BASE_URL+'/sms/send', payload);
      res.status(200).send(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to send SMS' });
  }
});


app.get('/hadis', async (req, res) => {
  const payload = {
     id: 10,
     title: "Sondor Hadis",
     text: "Onek Sondor Hadis"
  };
    
  res.status(200).send(payload)
});







// Start the server
app.listen(port, () => {
  console.log("Server is running on http://localhost:${port}");
});