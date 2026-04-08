import axios from 'axios';

const testAdminLogin = async () => {
  try {
    console.log('=== TESTING ADMIN LOGIN COOKIE SETTING ===');
    
    // Test admin login
    const response = await axios.post('http://localhost:5001/api/admin/login', {
      email: 'admin@jobportal.com',
      password: 'admin123'
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login Response:', response.data);
    console.log('Response Headers:', response.headers);
    console.log('Set-Cookie Header:', response.headers['set-cookie']);
    
    // Test if we can access applications immediately after login
    try {
      const appsResponse = await axios.get('http://localhost:5001/api/admin/applications', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Applications Response:', appsResponse.data);
    } catch (appError) {
      console.log('Applications Error:', appError.response?.data);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

testAdminLogin();
