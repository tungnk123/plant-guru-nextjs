"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles, Star, Zap, Crown, Gem } from "lucide-react";
import { useEffect, useState } from "react";
import MembershipService from "@/app/admin/api/membership";
import { Membership } from "@/app/admin/api/membership";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { goPremium } from "@/app/admin/api/user";

const getPlanIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Star className="h-12 w-12 text-yellow-500" />;
    case 1:
      return <Gem className="h-12 w-12 text-purple-500" />;
    case 2:
      return <Crown className="h-12 w-12 text-blue-500" />;
    default:
      return <Zap className="h-12 w-12 text-gray-500" />;
  }
};

const getGradientByIndex = (index: number) => {
  switch (index) {
    case 0:
      return "bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 hover:from-yellow-100 hover:to-yellow-200";
    case 1:
      return "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 hover:from-purple-100 hover:to-purple-200";
    case 2:
      return "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 hover:from-blue-100 hover:to-blue-200";
    default:
      return "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 hover:from-gray-100 hover:to-gray-200";
  }
};

export default function PricingContent() {
  const [plans, setPlans] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.paypal) {
        plans.forEach((plan, index) => {
          window.paypal
            .Buttons({
              style: {
                layout: "horizontal",
                color: "blue",
                shape: "rect",
                label: "paypal",
                height: 40,
              },
              createOrder: (data, actions) => {
                setPaymentLoading(true);
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: plan.price.toString(),
                      },
                    },
                  ],
                });
              },
              onApprove: (data, actions) => {
                return actions.order
                  .capture()
                  .then((details) => {
                    toast.success(
                      `Transaction completed by ${details.payer.name.given_name}`
                    );
                    handlePostPayment(details);
                  })
                  .finally(() => {
                    setPaymentLoading(false);
                  });
              },
              onError: (err) => {
                console.error("PayPal Checkout error:", err);
                setPaymentLoading(false);
                toast.error(
                  "There was an error processing your payment. Please try again."
                );
              },
            })
            .render(`#paypal-button-container-${index}`);
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [plans]);

  const handlePostPayment = async (details) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in");

      await goPremium(userId);

      toast.success("Successfully upgraded to Premium!");
    } catch (error) {
      console.error("Error handling post-payment:", error);
      toast.error("There was an error processing your payment. Please try again.");
    }
  };

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
    <div className="container mx-auto py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-600 text-transparent bg-clip-text">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Select the plan that best suits your needs and start your journey with
          us today
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex"
          >
            <Card
              className={`relative flex flex-col w-full transform transition-all duration-300 hover:scale-105 ${getGradientByIndex(
                index
              )} ${index === 1 ? "ring-2 ring-purple-500 shadow-xl" : "shadow-lg"}`}
            >
              <CardHeader className="space-y-4 text-center pt-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-white shadow-inner">
                    {getPlanIcon(index)}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex justify-center items-baseline space-x-2">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 font-medium">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow px-6">
                <div className="space-y-4 mt-6">
                  {plan.description.split("\n").map(
                    (feature, i) =>
                      feature.trim() && (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="p-1 rounded-full bg-gradient-to-r from-green-400 to-teal-500">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-700">{feature.trim()}</span>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-6 px-6 pb-8">
                <div id={`paypal-button-container-${index}`} className="w-full" />
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
