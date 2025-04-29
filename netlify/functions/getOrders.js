const axios = require("axios");

exports.handler = async function (event, context) {
  try {
    const response = await axios.get("https://mothersmm.com/adminapi/v2/orders", {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "qje4lrolbtxr458ryiswdxh7irt9l4e920x4kwgylpucapqo9qk2145wmpfw53im"
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ এটা যুক্ত কর
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ data: response.data })
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ error response এও
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: "Failed to fetch orders", details: error.message })
    };
  }
};
