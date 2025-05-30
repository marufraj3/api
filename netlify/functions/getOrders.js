const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const {
      created_from = "0",
      created_to,
      order_status,
      mode,
      service_ids,
      creation_type,
      user,
      provider,
      ip_address,
      link,
      limit = "1000",
      offset = "0",
      sort = "date-desc"
    } = event.queryStringParameters || {};

    const baseUrl = 'https://mothersmm.com/adminapi/v2/orders';
    const url = new URL(baseUrl);

    // Convert limit/offset to numbers
    const offsetNum = parseInt(offset);
    const limitNum = parseInt(limit);

    // Add required query params
    url.searchParams.append('created_from', created_from);
    url.searchParams.append('limit', limitNum);
    url.searchParams.append('offset', offsetNum);
    url.searchParams.append('sort', sort);

    // Optional query params
    if (created_to) url.searchParams.append('created_to', created_to);
    if (order_status) url.searchParams.append('order_status', order_status);
    if (mode) url.searchParams.append('mode', mode);
    if (service_ids) url.searchParams.append('service_ids', service_ids);
    if (creation_type) url.searchParams.append('creation_type', creation_type);
    if (user) url.searchParams.append('user', user);
    if (provider) url.searchParams.append('provider', provider);
    if (ip_address) url.searchParams.append('ip_address', ip_address);
    if (link) url.searchParams.append('link', link);

    // Fetch orders
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.API_KEY || 'your-default-api-key'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error: ${response.status} ${errText}`);
    }

    const data = await response.json();

    // Build pagination links
    const baseApi = `${process.env.URL || 'https://eloquent-cannoli-ed1c57.netlify.app'}/.netlify/functions/getOrders`;
    const queryParams = new URLSearchParams({
      created_from,
      limit: limitNum,
      sort
    });

    // Add optional filters to pagination URLs
    if (created_to) queryParams.append('created_to', created_to);
    if (order_status) queryParams.append('order_status', order_status);
    if (mode) queryParams.append('mode', mode);
    if (service_ids) queryParams.append('service_ids', service_ids);
    if (creation_type) queryParams.append('creation_type', creation_type);
    if (user) queryParams.append('user', user);
    if (provider) queryParams.append('provider', provider);
    if (ip_address) queryParams.append('ip_address', ip_address);
    if (link) queryParams.append('link', link);

    const prevOffset = Math.max(0, offsetNum - limitNum);
    const nextOffset = offsetNum + limitNum;

    const prevUrl = `${baseApi}?${queryParams.toString()}&offset=${prevOffset}`;
    const nextUrl = `${baseApi}?${queryParams.toString()}&offset=${nextOffset}`;

    // Final output
    const result = {
      ...data,
      pagination: {
        prev_page_href: prevOffset === offsetNum ? "" : prevUrl,
        next_page_href: nextUrl,
        offset: offsetNum,
        limit: limitNum
      }
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
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
