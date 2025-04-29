// netlify/functions/getOrders.js
const fetch = require('node-fetch'); // Needed for fetch in Node.js

exports.handler = async (event, context) => {
  try {
    const response = await fetch('https://mothersmm.com/adminapi/v2/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.API_KEY // 🔒 Hidden key
      }
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};