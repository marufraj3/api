// netlify/functions/getOrders.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const params = event.queryStringParameters || {};
    
    // Defaults if not provided
    const created_from = params.created_from || Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90; // last 90 days
    const limit = params.limit || 10;
    const offset = params.offset || 0;

    const url = `https://mothersmm.com/adminapi/v2/orders?created_from=${created_from}&limit=${limit}&offset=${offset}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
