"use client";

import { useEffect, useState } from "react";

export default function Me() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // accept cors
        'Access-Control-Allow-Origin': '*',
      },
      credentials: 'include',
    }).then((res) => res.json()).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return loading ? <div>Loading...</div> : <div>{JSON.stringify(user)}</div>
}