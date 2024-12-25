"use client";
import React from 'react';
import Navbar from '@/app/components/navbar/Navbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

export default function PlantWikiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggle={() => {}} />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Plant Wiki
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover and learn about different plant species, their care requirements, and growing tips.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search plants..." 
                  className="h-12 text-lg"
                />
                <Button className="h-12 px-6 bg-green-600 hover:bg-green-700">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div 
                key={category.name}
                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-gray-200 mt-2">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Plants Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Plants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlants.map((plant) => (
              <div 
                key={plant.name}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img 
                    src={plant.image} 
                    alt={plant.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plant.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const categories = [
  {
    name: "Indoor Plants",
    description: "Perfect plants for home decoration and air purification",
    image: "/images/categories/indoor.jpg"
  },
  {
    name: "Succulents",
    description: "Low-maintenance plants perfect for beginners",
    image: "/images/categories/succulents.jpg"
  },
  {
    name: "Flowering Plants",
    description: "Beautiful blooming plants to add color to your garden",
    image: "/images/categories/flowering.jpg"
  }
];

const featuredPlants = [
  {
    name: "Snake Plant",
    description: "Easy to care, air-purifying indoor plant",
    image: "/images/plants/snake-plant.jpg"
  },
  {
    name: "Monstera Deliciosa",
    description: "Tropical plant with unique split leaves",
    image: "/images/plants/monstera.jpg"
  },
  {
    name: "Peace Lily",
    description: "Elegant flowering plant that thrives in low light",
    image: "/images/plants/peace-lily.jpg"
  },
  {
    name: "Fiddle Leaf Fig",
    description: "Popular indoor tree with large, violin-shaped leaves",
    image: "/images/plants/fiddle-leaf.jpg"
  }
];
