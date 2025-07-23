'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { graphql } from '@/lib/graphql';
import { LOGOUT } from '@/graphql/mutations';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await graphql(LOGOUT);
      router.push('/student/login');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <Button onClick={handleLogout} className='mx-4'>
      Logout
    </Button>
  );
}
