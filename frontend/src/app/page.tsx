"use client";

import { useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    api
      .get("/test")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Frontend Connected</h1>
      <div className="p-10">
        <h1 className="text-2xl font-bold">Project Manhatten App</h1>

        <p>Authenticated: {isAuthenticated ? "YES" : "NO"}</p>

        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </main>
  );
}
