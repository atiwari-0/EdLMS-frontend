'use client'
import LoginForm from '../../components/LoginForm';

export default function StudentLoginPage() {
  const handleLogin = async (email: string, password: string) => {
    const res = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
              token
              role
            }
          }
        `,
      }),
    });

    const { data } = await res.json();
    if (data?.login?.token) {
      document.cookie = `token=${data.login.token}; path=/`;
      window.location.href = '/student';
    } else {
      throw new Error('Login failed');
    }
  };

  return <LoginForm title="Student Login" onSubmit={handleLogin} />;
}
