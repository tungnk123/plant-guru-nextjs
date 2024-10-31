"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Logo = () => {
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 && window.innerWidth < 768) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);

    return () => window.removeEventListener("scroll", changeNavButton);
  }, []);

  return (
    <div className="flex items-center space-x-1">
      <Link href="/" style={{ display: showButton ? "none" : "block" }}>
        <Image
          src="/images/ic_logo.svg"
          alt="Logo"
          width="48"
          height="48"
          className="relative"
        />
      </Link>
      <p className="text-2xl text-green-500 font-bold">PLANTGURU</p>
    </div>
  );
  
};

export default Logo;
