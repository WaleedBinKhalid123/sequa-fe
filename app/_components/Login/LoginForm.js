"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/_lib/features/user/userSlice";

export default function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const userNameRef = useRef(null);
  const passwordRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsHydrated(true);
    userNameRef.current?.focus();
  }, []);

  const isDisabled = !userName || !password || loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName, password }),
      });

      const data = await res.json();

      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        dispatch(setUser({ user: data.data.user, token: data.data.token }));
        router.push("/");
      } else {
        setLoading(false);
        setPassword("");
        passwordRef.current?.focus();
        setError("Login failed. No token received.");
      }
    } catch (err) {
      setLoading(false);
      setPassword("");
      passwordRef.current?.focus();
      console.error(err.message || err);
      setError("Login failed. Check your credentials.");
    }
  };

  // Show loading state until hydration is complete to prevent layout shifts
  if (!isHydrated) {
    return (
      <div className="login-container h-screen flex items-center justify-center px-[clamp(1rem,6vw,14rem)] bg-white" style={{ height: '100vh', minHeight: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="bg-white rounded-[clamp(0.75rem,1vw,2rem)] border-[clamp(1px,0.12vw,3px)] border-neutral-200 w-[27rem] xl:w-[32rem] 2xl:w-[34vw] wi-4xl p-[clamp(1rem,3vw,4.5rem)]">
          <div className="flex flex-col items-center md:mb-5 xl:mb-[clamp(0.75rem,1.5vw,4rem)]">
            <div className="w-full max-sm:px-4 md:w-[21.5rem] xl:w-[25rem] 2xl:w-[37rem] logo-wi-3xl logo-wi-4xl logo-wi-5xl mb-[clamp(1rem,4vw,4rem)]" style={{ height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="w-48 h-48 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container h-screen flex items-center justify-center px-[clamp(1rem,6vw,14rem)] bg-white" style={{ height: '100vh', minHeight: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-[clamp(0.75rem,1vw,2rem)] border-[clamp(1px,0.12vw,3px)] border-neutral-200 w-[27rem] xl:w-[32rem] 2xl:w-[34vw] wi-4xl p-[clamp(1rem,3vw,4.5rem)]">
        <div className="flex flex-col items-center md:mb-5 xl:mb-[clamp(0.75rem,1.5vw,4rem)]">
          <div className="w-full max-sm:px-4 md:w-[21.5rem] xl:w-[25rem] 2xl:w-[37rem] logo-wi-3xl logo-wi-4xl logo-wi-5xl mb-[clamp(1rem,4vw,4rem)]" style={{ height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src="/logo.svg"
              alt="Sequoia Internal Logo"
              width={190}
              height={190}
              className="max-w-full max-h-full object-contain"
              priority
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ minHeight: '300px' }}>
          <div className="mb-5 xl:mb-[clamp(0.75rem,1.5vw,4rem)]">
            <label
              htmlFor="userName"
              className="block mb-[0.25rem] text-[clamp(0.875rem,1.2vw,2.9rem)] font-[clamp(400,1.2vw,500)] text-form-label-login-text"
            >
              Username
            </label>
            <input
              id="userName"
              type="text"
              ref={userNameRef}
              autoComplete="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full h-[clamp(2.75rem,3.5vw,10rem)] rounded-[clamp(0.5rem,0.58vw,2rem)] border-[clamp(1px,0.1vw,3px)] border-form-border-color px-[clamp(0.75rem,2vw,1.25rem)] py-2 text-[clamp(1rem,0.9vw,3rem)] text-black focus:outline-none focus:ring-1 xl:focus:ring-1.5 2x:focus:ring-2.5 focus:ring-form-focus-field-ring focus:shadow-form-focus-field"
            />
          </div>

          <div className="mb-5 lg:mb-[clamp(0.75rem,1.5vw,4rem)]">
            <label
              htmlFor="password"
              className="block mb-[0.25rem] text-[clamp(0.875rem,1.2vw,2.9rem)] font-[clamp(400,1.2vw,500)] text-form-label-login-text"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[clamp(2.75rem,3.5vw,10rem)] rounded-[clamp(0.5rem,0.58vw,2rem)] border-[clamp(1px,0.1vw,3px)] border-form-border-color px-[clamp(0.75rem,2vw,1.25rem)] py-2 text-[clamp(1rem,0.9vw,3rem)] text-black focus:outline-none focus:ring-1 xl:focus:ring-1.5 2x:focus:ring-2 focus:ring-form-focus-field-ring focus:shadow-form-focus-field"
            />
          </div>

          <div style={{ minHeight: '40px' }}>
            {error && (
              <div className="text-red-500 text-[clamp(1rem,0.9vw,3rem)] mb-[clamp(1rem,1.8vw,2rem)]">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full h-[clamp(2.75rem,3.5vw,10rem)] rounded-[clamp(0.5rem,0.58vw,2rem)] text-[clamp(0.875rem,1.2vw,2.9rem)] font-semibold transition mb-5 lg:mb-[clamp(0.7rem,1.5vw,3rem)] ${
              isDisabled
                ? "bg-form-submit-button-bg-disabled text-form-submit-button-text-disabled opacity-50 cursor-not-allowed"
                : "bg-form-submit-button-bg text-form-submit-button-text"
            }`}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
