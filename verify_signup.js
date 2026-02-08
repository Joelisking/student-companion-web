async function testRegistration() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';

  console.log('Testing registration with:', email);

  try {
    // 1. Successful registration
    const res = await fetch(
      'http://localhost:5000/api/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();
    console.log('Registration Status:', res.status);
    console.log('Registration Response:', data);

    if (res.status === 201 && data.userId) {
      console.log('✅ SUCCESS: User registered');
    } else {
      console.error('❌ FAILURE: Registration failed');
    }

    // 2. Duplicate email
    const resDuplicate = await fetch(
      'http://localhost:5000/api/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    console.log(
      'Duplicate Registration Status:',
      resDuplicate.status
    );
    if (resDuplicate.status === 409) {
      console.log('✅ SUCCESS: Duplicate email rejected');
    } else {
      console.error(
        '❌ FAILURE: Duplicate email allowed or wrong status'
      );
    }

    // 3. Short password
    const resShort = await fetch(
      'http://localhost:5000/api/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `short_${Date.now()}@example.com`,
          password: 'short',
        }),
      }
    );
    console.log('Short Password Status:', resShort.status);
    if (resShort.status === 400) {
      console.log('✅ SUCCESS: Short password rejected');
    } else {
      console.error('❌ FAILURE: Short password allowed');
    }
  } catch (err) {
    console.error('Test Error:', err);
  }
}

testRegistration();
