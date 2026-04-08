import axios from 'axios';

const testEmail = async () => {
  try {
    console.log('🧪 Testing /api/apply endpoint...');
    
    const testData = {
      user_name: "Test User",
      user_email: "adhityabollam@gmail.com", 
      job_role: "Frontend Developer",
      company_name: "Google"
    };

    console.log('📧 Test data:', testData);

    const response = await axios.post('http://localhost:5001/api/application/apply', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Response:', response.data);
    console.log('✅ Status:', response.status);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testEmail();
