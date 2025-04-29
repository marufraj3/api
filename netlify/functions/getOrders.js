const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const API_URL = 'https://mothersmm.com/adminapi/v2/orders';
  const API_KEY = process.env.API_KEY;

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

      if (!data.data || !data.data.list) {
        throw new Error('Unexpected API response: "list" not found');
      }

      const orders = data.data.list;
      allOrders.push(...orders);

      // Check for next page
      if (data.data.pagination && data.data.pagination.next_page_href) {
        offset += 100;
      } else {
        hasNextPage = false;
      }
    }

    // ✅ Filter only "completed" orders
    const completedOrders = allOrders.filter(order => order.status.toLowerCase() === 'completed');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        totalCompletedOrders: completedOrders.length,
        completedOrders
      })
    };

  } catch (error) {
    console.error('Error:', error);
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
