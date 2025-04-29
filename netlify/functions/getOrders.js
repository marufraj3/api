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

    const data = await response.json();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completedOrdersLast7Days = data.orders.filter(order => {
      return (
        order.status === 'Completed' &&
        new Date(order.completed_at) >= sevenDaysAgo
      );
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        count: completedOrdersLast7Days.length,
        orders: completedOrdersLast7Days
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
