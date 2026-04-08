import axios from 'axios';

// Create a custom axios instance that handles cookies properly
const adminAPI = axios.create({
  baseURL: 'http://localhost:5001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const testAdminAPI = async () => {
  try {
    console.log('=== TESTING ADMIN API ===');
    
    // First login as admin
    console.log('1. Testing admin login...');
    const loginResponse = await adminAPI.post('/api/admin/login', {
      email: 'admin@jobportal.com',
      password: 'admin123'
    });
    
    console.log('Admin login response:', loginResponse.data);
    
    // Now test the applications endpoint with the same axios instance
    console.log('\n2. Testing applications endpoint...');
    const applicationsResponse = await adminAPI.get('/api/admin/applications');
    
    console.log('Applications API Response:');
    console.log('Success:', applicationsResponse.data.success);
    console.log('Number of applications:', applicationsResponse.data.applications.length);
    
    // Show first application details
    if (applicationsResponse.data.applications.length > 0) {
      const firstApp = applicationsResponse.data.applications[0];
      console.log('\nFirst Application:');
      console.log('User:', firstApp.applicant?.fullname || 'N/A');
      console.log('Email:', firstApp.applicant?.email || 'N/A');
      console.log('Job:', firstApp.job?.title || 'N/A');
      console.log('Company:', firstApp.job?.company || 'N/A');
      console.log('Resume:', firstApp.resume || 'N/A');
      console.log('Status:', firstApp.status || 'N/A');
    }
    
    console.log('\n=== ADMIN API TEST SUCCESSFUL ===');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('Authentication failed - checking if admin exists...');
    }
    process.exit(1);
  }
};

testAdminAPI();
