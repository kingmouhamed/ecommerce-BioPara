import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!clerkSecretKey) {
  console.error("Missing CLERK_SECRET_KEY in .env.local");
  process.exit(1);
}

async function createClerkUser() {
  const email = 'testuser@biopara.com';
  const password = 'Password123!';

  const response = await fetch('https://api.clerk.com/v1/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${clerkSecretKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: [email],
      password: password,
      skip_password_checks: true,
      skip_password_requirement: true
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error creating Clerk user:', JSON.stringify(errorData, null, 2));
  } else {
    const data = await response.json();
    console.log('Clerk test user created successfully:', data.id);
  }
}

createClerkUser();
