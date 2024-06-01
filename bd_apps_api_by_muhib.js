const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const BASE_URL = "https://developer.bdapps.com"
const APP_ID = "APP_118891";
const APP_HASH = "bal"
const APP_PASS = "14ca866624387c7f315aa627f6760438"
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


// Check Subscription Status
app.post('/subscription_status', async (req, res) => {
  try {
    const subscriberId = req.query.subscriberId;


    // Check if all required fields are present
    if (!subscriberId) {
      throw new Error('Subscriber Id not provided');
    }

    console.log(NUM_EXT + subscriberId);

    // Make a POST request to check subscription status
    const response = await axios.post(BASE_URL + '/subscription/getStatus', {
      applicationId: APP_ID,
      password: APP_PASS,
      subscriberId: NUM_EXT + subscriberId
    }, {
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
app.post('/request_otp', async (req, res) => {

  try {
    const subscriberId = req.query.subscriberId;

    console.log(subscriberId + "\n");

    // Check if all required fields are present
    if (!subscriberId) {
      throw new Error('Subscriber Id not provided');
    }


    // Make a POST request to bdapps.com/sub
    const response = await axios.post(BASE_URL + '/subscription/otp/request/', {
      applicationId: APP_ID,
      password: APP_PASS,
      subscriberId: NUM_EXT + subscriberId,
      applicationHash: APP_HASH,
      applicationMetaData: META_DATA
    }, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });


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





//  Verify OTP
app.post('/verify_otp', async (req, res) => {
  try {
    const referenceNo = req.query.referenceNo;
    const otp = req.query.otp

    // Check if all required fields are present and non-empty strings
    if (!referenceNo || !otp) {
      throw new Error('Invalid request body');
    }

    // Make a POST request to verify OTP
    const response = await axios.post(BASE_URL + '/subscription/otp/verify', {
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




// Unsubscribe A User
app.post('/unsubscribe', async (req, res) => {
  try {
    const subscriberId = req.query.subscriberId;


    // Check if all required fields are present
    if (!subscriberId) {
      throw new Error('Subscriber Id not provided');
    }

    console.log(NUM_EXT + subscriberId);

    // Make a POST request to unsubscribe the user
    const response = await axios.post(BASE_URL + '/subscription/getStatus', {
      applicationId: APP_ID,
      password: APP_PASS,
      subscriberId: NUM_EXT + subscriberId,
      action: "0"

    }, {
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



// Start the server
app.listen(port, () => {
  console.log("Server is running on http://localhost:${port}");
});