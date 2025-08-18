"use client";

import { useRef } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/app/config";
import { useRouter } from "next/navigation"; // ✅ correct for App Router

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    try {
      await axios.post(HTTP_BACKEND + "/signup", {
        name,
        password,
        username: username,
      });
      router.push("/signin");
      alert("You have signed up");
    } catch (e) {
      alert("Signup failed");
      console.log(e);
    }
  }

  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    console.log(HTTP_BACKEND);
    try {
      const res=await axios.post(HTTP_BACKEND + "/signin", {
        password,
        username: username,
      });
      const jwt=res.data.token;
      localStorage.setItem("token",jwt);
      router.push("/authroom");
      alert("You have signed in");
    } catch (e) {
      alert("Signin failed");
      console.log(e);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-950">
      <div className="p-8 bg-white rounded-xl shadow-xl w-80 space-y-4 text-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSignin ? "Welcome Back" : "Create an Account"}
        </h2>

        {!isSignin && (
          <div>
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Name"
              ref={nameRef}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <input
            suppressHydrationWarning
            type="email"
            ref={usernameRef}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            suppressHydrationWarning
            type="password"
            ref={passwordRef}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          suppressHydrationWarning
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          onClick={() => {
            isSignin ? signin() : signup();
          }}
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
