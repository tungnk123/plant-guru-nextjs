"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/navbar/Navbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ThumbsUp, Users, Leaf } from 'lucide-react';
import { fetchWikiCards, WikiCard } from '@/app/api/wikiService';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlantWikiPage() {
  const router = useRouter();
  const [wikiCards, setWikiCards] = useState<WikiCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadWikiCards();
  }, []);

  const loadWikiCards = async () => {
    try {
      const cards = await fetchWikiCards();
      setWikiCards(cards);
    } catch (error) {
      toast.error('Failed to load wiki articles');
      console.error('Error loading wiki cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCards = wikiCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar toggle={() => {}} />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="outline" className="px-4 py-1 text-lg font-medium text-emerald-600 border-emerald-200 bg-emerald-50">
                <Leaf className="w-5 h-5 mr-2" />
                Plant Encyclopedia
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Plant Wiki
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover and learn about different plant species, their care requirements, and growing tips.
            </p>
            
            {/* Search and Create Button */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    placeholder="Search plants..." 
                    className="h-12 text-lg pl-10 pr-4 w-full border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => router.push('/plant-wiki/create')}
                  className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-200 transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Wiki
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wiki Cards Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Wiki Articles</h2>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredCards.length} articles
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <Card 
                  key={card.title}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-100"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-gray-100">
                      {card.thumbnailImageUrl ? (
                        <img 
                          src={card.thumbnailImageUrl} 
                          alt={card.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Leaf className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-gray-500 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {card.upvotes}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {card.contributorCount} contributors
                      </Badge>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredCards.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or create a new article.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
