import axios from 'axios';

const testAdminAPI = async () => {
  try {
    // First login as admin
    const loginResponse = await axios.post('http://localhost:5001/api/admin/login', {
      email: 'admin@jobportal.com',
      password: 'admin123'
    }, {
      withCredentials: true
    });
    
    console.log('Admin login successful:', loginResponse.data.success);
    
    // Now test the applications endpoint
    const applicationsResponse = await axios.get('http://localhost:5001/api/admin/applications', {
      withCredentials: true
    });
    
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
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

testAdminAPI();
