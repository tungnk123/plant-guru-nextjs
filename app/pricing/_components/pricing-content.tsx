"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Star, Zap, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import MembershipService from '@/app/admin/api/membership';
import { Membership } from '@/app/admin/api/membership';
import { motion } from 'framer-motion';

const getPlanIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Star className="h-8 w-8 text-yellow-500" />;
    case 1:
      return <Sparkles className="h-8 w-8 text-purple-500" />;
    case 2:
      return <Crown className="h-8 w-8 text-blue-500" />;
    default:
      return <Zap className="h-8 w-8 text-gray-500" />;
  };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

export default function PricingContent() {
  const [plans, setPlans] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await MembershipService.getMemberships();
        setPlans(data);
      } catch (err) {
        setError('Failed to load pricing plans');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-16 text-red-500 animate-fade-in">
      {error}
    </div>
  );

  if (plans.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No membership plans available at the moment.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              index === 1 ? 'border-2 border-primary' : ''
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  {getPlanIcon(index)}
                  {index === 1 && (
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="mt-2 min-h-[60px]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <div className="space-y-4">
                  {plan.description.split(';').map((feature, i) => (
                    feature.trim() && (
                      <div key={i} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature.trim()}</span>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full group relative overflow-hidden"
                  variant={index === 1 ? "default" : "outline"}
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 