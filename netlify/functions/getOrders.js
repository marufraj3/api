const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const response = await fetch('https://mothersmm.com/adminapi/v2/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const apiResponse = await response.json();
    const orders = apiResponse.data.list;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completedOrders = orders.filter(order => {
      return (
        order.status.toLowerCase() === 'completed' &&
        new Date(order.created) >= sevenDaysAgo
      );
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        count: completedOrders.length,
        orders: completedOrders
      })
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
