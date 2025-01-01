"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles, Star, Zap, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import MembershipService from "@/app/admin/api/membership";
import { Membership } from "@/app/admin/api/membership";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

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
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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
        setError("Failed to load pricing plans");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
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
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Choose the plan that's right for you
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`flex flex-col h-full transform transition-all duration-300 hover:scale-105 ${
                index === 1
                  ? "bg-gradient-to-br from-purple-600 to-indigo-400 text-white shadow-lg"
                  : "bg-white shadow-md"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  {getPlanIcon(index)}
                  {index === 1 && (
                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <CardTitle
                  className={`text-2xl font-bold ${
                    index === 1 ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      index === 1 ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatPrice(plan.price)}
                  </span>
                  <span
                    className={`${
                      index === 1 ? "text-gray-200" : "text-gray-500"
                    } ml-2`}
                  >
                    /month
                  </span>
                </div>
                <div className="space-y-4">
                  {plan.description.split("\n").map(
                    (feature, i) =>
                      feature.trim() && (
                        <div
                          key={i}
                          className="flex items-center space-x-3"
                        >
                          <Check
                            className={`h-5 w-5 ${
                              index === 1
                                ? "text-green-300"
                                : "text-green-500"
                            }`}
                          />
                          <span
                            className={`${
                              index === 1 ? "text-gray-100" : "text-gray-600"
                            }`}
                          >
                            {feature.trim()}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <button
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    index === 1
                      ? "bg-white text-primary hover:bg-gray-200"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  Choose Plan
                </button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
