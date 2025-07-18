'use client'
import LoginTitle from '@/components/Auth/LoginTitle';
import LoginForm from '../../../components/Auth/LoginForm';

export default function AdminLoginPage() {
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
      window.location.href = '/admin/dashboard';
    } else {
      throw new Error('Login failed');
    }
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
    <LoginTitle />
    <LoginForm title="Admin Login" onSubmit={handleLogin} />
  </div>
</div>
);
}
