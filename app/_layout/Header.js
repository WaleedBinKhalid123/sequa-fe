"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  return (
    <header className="bg-white md:border-b border-[#D5DEE9] flex justify-between items-center px-2.5 md:px-[clamp(1rem,2vw,8rem)] py-2.5 md:py-[clamp(1.5rem,1.7vw,5.5rem)] sticky top-0 z-50">
      <Image
        src="/header-logo.png"
        alt="Sequoia Internal Logo"
        width={190}
        height={60}
        className="object-contain w-28 md:w-[clamp(10rem,16vw,42rem)] md:h-[clamp(3.5rem,5vw,14rem)]"
        priority
      />

      <Image
        src={user?.profileImageUrl || "/default-profile.png"}
        alt="User Profile"
        width={50}
        height={50}
        className="rounded-full border-2 border-gray-300 object-cover w-10 md:w-[clamp(3.8rem,4.5vw,16rem)] md:h-[clamp(3.8rem,4.5vw,16rem)]"
        priority
      />
    </header>
  );
};
