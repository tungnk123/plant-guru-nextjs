"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '@/app/components/navbar/Navbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Leaf, Filter, Search, SortAsc, SortDesc, Calendar, Plus, Users2, Eye } from 'lucide-react';

export default function PlantWikiPage() {   
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest');
  const [wikiArticles, setWikiArticles] = useState<WikiCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articles = await fetchWikiCards();
        setWikiArticles(articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredAndSortedArticles = useMemo(() => {
    return [...wikiArticles]
      .filter(article => {
        const searchLower = searchTerm.toLowerCase();
        return (
          article.title?.toLowerCase().includes(searchLower) ||
          article.description?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'newest':
            return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
          case 'oldest':
            return new Date(a.createdAt || Date.now()).getTime() - new Date(b.createdAt || Date.now()).getTime();
          case 'a-z':
            return (a.title || '').localeCompare(b.title || '');
          case 'z-a':
            return (b.title || '').localeCompare(a.title || '');
          default:
            return 0;
        }
      });
  }, [wikiArticles, searchTerm, sortOrder]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar toggle={() => {}} />
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4 shadow-inner">
                <Leaf className="h-10 w-10 text-green-600" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              />
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Plant Wiki
            </h1>
            <p className="text-gray-600 max-w-lg mb-6">
              Discover and share knowledge about plants with our growing community
            </p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.push('/plant-wiki/create')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-200/50 transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Article
                    <Sparkles className="h-4 w-4 ml-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share your plant knowledge!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <Card className="border-gray-200/50 shadow-xl backdrop-blur-sm bg-white/80">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-gray-900 justify-center">
                  <Filter className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold">Search & Filters</h2>
                </div>
                <Separator className="mt-4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative max-w-xl mx-auto group">
                  <div className="absolute inset-0 bg-green-200 opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-full" />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  <Input
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-12 text-lg border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm('')}
                    >
                      ×
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Select
                    value={sortOrder}
                    onValueChange={(value: 'newest' | 'oldest' | 'a-z' | 'z-a') => setSortOrder(value)}
                  >
                    <SelectTrigger className="w-[200px] border-gray-200 bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <SortDesc className="h-4 w-4 text-green-600" />
                        <SelectValue placeholder="Sort articles" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          Newest First
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          Oldest First
                        </div>
                      </SelectItem>
                      <Separator className="my-2" />
                      <SelectItem value="a-z">
                        <div className="flex items-center gap-2">
                          <SortAsc className="h-4 w-4 text-green-600" />
                          Title A to Z
                        </div>
                      </SelectItem>
                      <SelectItem value="z-a">
                        <div className="flex items-center gap-2">
                          <SortAsc className="h-4 w-4 rotate-180 text-green-600" />
                          Title Z to A
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Badge 
                    variant="secondary" 
                    className="bg-green-50 text-green-700 px-4 py-2 shadow-sm"
                  >
                    {filteredAndSortedArticles.length} article(s) found
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSortedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200/50 bg-white/80 backdrop-blur-sm"
                  onClick={() => router.push(`/plant-wiki/${article.id}`)}
                >
                  {article.thumbnailImageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={article.thumbnailImageUrl}
                        alt={article.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Users2 className="h-3 w-3" />
                          <span>{article.contributorCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </div>
                      </div>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

