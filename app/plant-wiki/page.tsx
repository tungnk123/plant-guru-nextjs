"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/navbar/Navbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ThumbsUp, Users, Leaf, Eye } from 'lucide-react';
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
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar toggle={() => {}} />
        <div className="pt-24 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

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
                    placeholder="Search wiki articles..." 
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
                <Link 
                  href={`/plant-wiki/${card.id}`} 
                  key={card.id}
                  className="block hover:no-underline"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="aspect-video relative">
                        <img
                          src={card.thumbnailImageUrl || '/placeholder.png'}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{card.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {card.upvotes} upvotes
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {card.contributorCount || 0} contributors
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
