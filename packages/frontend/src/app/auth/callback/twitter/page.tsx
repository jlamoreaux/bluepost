"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'

export default function TwitterAuthPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  useEffect(() => {
    fetch('/api/auth/callback/twitter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      credentials: 'include',
      body: JSON.stringify({code}),
    })
      .then(async (res) => await res.json())
      .then((data) => {
        console.log({ data });
        if (data.success) {
          setAuthenticated(true);
          if (window) window.location.href = '/dashboard';
        } else {
          setError(data?.error);
        }
      })
      .catch((error) => {
        console.error(error);
        setError('An error occurred during authentication');
      });
  }, [code]);

  if (authenticated) return null;
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F4F6] text-[#1F2937]">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F4F6] text-[#1F2937]">
      Authenticating...
    </div>
  )
}