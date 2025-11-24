"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const submit = async (e:any) => {
    e.preventDefault();

    const res = await fetch("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Wrong password, try again");
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Enter Admin Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
