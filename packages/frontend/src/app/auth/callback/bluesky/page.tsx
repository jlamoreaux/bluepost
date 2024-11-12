"use client";
import { useEffect, useState } from "react";

export default function BlueskyCallback() {
  const [code, setCode] = useState<string | null>(null);
  const [iss, setIss] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    // Check if we are in a client-side environment
    if (typeof window !== 'undefined') {
      // Access the anchor using window.location.hash
      const anchor = decodeURIComponent(window.location.hash.slice(1)); // remove the #
      console.log('Anchor:', anchor);
      anchor.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        switch (key) {
          case 'code':
            setCode(value);
            break;
          case 'iss':
            setIss(value);
            break;
          case 'state':
            setState(value);
            break;
        }
      });
    };
  }, []);

  useEffect(() => {
    fetch('/api/auth/callback/bluesky', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      credentials: 'include',
      body: JSON.stringify({ code, iss, state }),
    })
      .then(async (res) => await res.json())
      .then((data) => {
        console.log({ data });
        if (data.success) {
          if (window) window.location.href = '/dashboard';
        }
      })
      .catch((error) => {
        console.error(error);
      }
    )
  }, [code, iss, state]);
  return (
    <div>
      <h1>Bluesky Callback</h1>
      {code && <p>Code: {code}</p>}
      {iss && <p>Iss: {iss}</p>}
      {state && <p>State: {state}</p>}
    </div>
  )
}