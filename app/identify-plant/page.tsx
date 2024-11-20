"use client";
import Navbar from "@/app/components/navbar/Navbar";
import PlantIdentifier from "@/app/identify-plant/PlantIdentifier";
import { useState } from "react";

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="w-full">
      <section className="w-full">
        <Navbar toggle={toggleMenu} />
        <PlantIdentifier />
      </section>
    </div>
  );
};

export default Page;
