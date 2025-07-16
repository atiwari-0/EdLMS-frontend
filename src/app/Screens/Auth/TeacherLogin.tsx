'use client'
import LoginForm from '../../components/LoginForm';

export default function TeacherLoginPage() {
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
      window.location.href = '/teacher';
    } else {
      throw new Error('Login failed');
    }
  };

  return <LoginForm title="Teacher Login" onSubmit={handleLogin} />;
}
