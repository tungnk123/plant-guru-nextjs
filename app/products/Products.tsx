"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts, ProductData } from '@/app/api/productService';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, ShoppingBag, Sparkles, Tag, ArrowUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filterAndSortProducts = () => {
        let filtered = [...products];

        if (searchQuery) {
          filtered = filtered.filter(product =>
            product.productName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (priceRange !== 'all') {
          filtered = filtered.filter(product => {
            if (priceRange === 'low') return product.price < 50;
            if (priceRange === 'medium') return product.price >= 50 && product.price <= 100;
            if (priceRange === 'high') return product.price > 100;
            return true;
          });
        }

        if (sortOrder === 'priceAsc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'priceDesc') {
          filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
      };

      filterAndSortProducts();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, priceRange, sortOrder, products]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 py-8">
          <div className="flex justify-center">
            <Badge variant="outline" className="bg-orange-50 text-orange-600 px-4 py-1 text-sm font-medium border-orange-200">
              <Sparkles className="h-4 w-4 mr-2" />
              Discover Amazing Products
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Our Products Collection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated selection of premium products
          </p>
        </div>

        {/* Filters Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <SlidersHorizontal className="h-5 w-5 text-orange-500" />
                Filter & Sort
              </CardTitle>
              <CardDescription className="text-orange-500">
                {filteredProducts.length} Products Found
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/90 border-orange-100 focus-visible:ring-orange-400"
                />
              </div>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/90 border-orange-100">
                  <Tag className="h-4 w-4 mr-2 text-orange-500" />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Below $50</SelectItem>
                  <SelectItem value="medium">$50 - $100</SelectItem>
                  <SelectItem value="high">Above $100</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/90 border-orange-100">
                  <ArrowUpDown className="h-4 w-4 mr-2 text-orange-500" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                  <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="transform hover:scale-105 transition-all duration-300">
                <Card className="group h-full overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-2xl">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      src={product.productImages.length > 0 ? product.productImages[0] : '/images/ic_logo.svg'}
                      alt={product.productName}
                    />
                    {product.quantity === 0 && <OutOfStockBadge />}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {product.productName}
                      </h3>
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
                        ${product.price.toFixed(2)}
                      </Badge>
                    </div>
                    <Separator className="bg-gradient-to-r from-orange-100 to-transparent" />
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <ShoppingBag className="h-4 w-4 text-orange-500" />
                        Stock: {product.quantity}
                      </span>
                      <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0">
                        View Details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </ScrollArea>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card className="py-12 text-center bg-white/50 backdrop-blur-sm">
            <CardContent>
              <div className="flex flex-col items-center gap-2">
                <Search className="h-12 w-12 text-orange-300" />
                <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Products; 