import axios from 'axios';

// Test the employee summary endpoint
const testEmployeeSummary = async () => {
  try {
    console.log('Testing employee summary functionality...');
    
    // First, let's login to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'Admin@gmail.com', // Use the admin account from Userseed.js
      password: 'admin'
    });

    if (loginResponse.data.success) {
      const token = loginResponse.data.token;
      console.log('✅ Login successful, token received');

      // Test creating a new employee (this should create both Employee and User)
      console.log('\n📝 Testing employee creation...');
      const createEmployeeResponse = await axios.post(
        'http://localhost:5000/api/employee/create',
        {
          name: 'Test Employee',
          email: 'test.employee@example.com',
          department: '507f1f77bcf86cd799439011', // You'll need to replace with actual department ID
          salary: 50000
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (createEmployeeResponse.data.success) {
        console.log('✅ Employee created successfully');
        console.log('📋 Default password:', createEmployeeResponse.data.message);
        
        // Now login as the new employee
        console.log('\n🔐 Testing employee login...');
        const employeeLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'test.employee@example.com',
          password: 'employee123'
        });

        if (employeeLoginResponse.data.success) {
          const employeeToken = employeeLoginResponse.data.token;
          console.log('✅ Employee login successful');

          // Test the employee summary endpoint
          console.log('\n📊 Testing employee summary...');
          const summaryResponse = await axios.post(
            'http://localhost:5000/api/employee/summary',
            {},
            {
              headers: {
                Authorization: `Bearer ${employeeToken}`
              }
            }
          );

          console.log('✅ Employee summary response:', summaryResponse.data);
        } else {
          console.log('❌ Employee login failed:', employeeLoginResponse.data);
        }
      } else {
        console.log('❌ Employee creation failed:', createEmployeeResponse.data);
      }
    } else {
      console.log('❌ Admin login failed:', loginResponse.data);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run the test
testEmployeeSummary();
