import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

async function updateClerkUser() {
  const userId = 'user_3F0AGWW0DMlNfdtD9oRuZ3NVvtQ';
  const strongPassword = 'BioParaTest$2026@Secure!';

  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${clerkSecretKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password: strongPassword,
      skip_password_checks: true
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error updating Clerk user:', JSON.stringify(errorData, null, 2));
  } else {
    console.log('Clerk test user updated successfully with strong password!');
  }
}

updateClerkUser();
