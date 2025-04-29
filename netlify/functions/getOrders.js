// netlify/functions/getOrders.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const response = await fetch('https://mothersmm.com/adminapi/v2/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.API_KEY // Netlify Environment Variable
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // ✅ Allow frontend to access
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // ✅ Even for errors
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
