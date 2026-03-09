const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.post('https://shg-6s8l.onrender.com/api/auth/register-user', {
      name: "Live Test Node",
      email: `livetestnode_${Math.random()}@example.com`,
      password: "password123",
      village: "Test Village",
      block: "Test Block"
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
    console.log("MESSAGE:", err.message);
  }
}

testApi();
