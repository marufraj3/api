const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const API_URL = 'https://mothersmm.com/adminapi/v2/orders';
  const API_KEY = process.env.API_KEY;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  let offset = 0;
  let allOrders = [];
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const url = `${API_URL}?offset=${offset}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const orders = data.data.list || [];
      allOrders.push(...orders);

      // Check if there's a next page
      if (data.data.pagination && data.data.pagination.next_page_href) {
        offset += 100;
      } else {
        hasNextPage = false;
      }
    }

    // Filter completed orders from last 7 days
    const completedOrders = allOrders.filter(order => {
      if (order.status.toLowerCase() !== 'completed') return false;
      const createdAt = new Date(order.created.replace(' ', 'T'));
      return createdAt >= sevenDaysAgo;
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        totalCompletedIn7Days: completedOrders.length,
        completedOrders
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
