'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// Define the schema for OrderData
const formSchema = z.object({
  userId: z.string().min(1, {
    message: 'User ID is required.'
  }),
  productId: z.string().min(1, {
    message: 'Product ID is required.'
  }),
  quantity: z.number().min(1, {
    message: 'Quantity must be at least 1.'
  }),
  totalPrice: z.number().min(0, {
    message: 'Total price must be a positive number.'
  }),
  shippingAddress: z.string().min(1, {
    message: 'Shipping address is required.'
  }),
  status: z.enum(['Pending', 'Not Paid', 'Paid', 'Failed', 'Success'], {
    required_error: 'Please select a status.'
  })
});

// Mock function to fetch user details
async function fetchUserName(userId: string): Promise<string> {
  // Replace this with your actual API call
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user details');
  }
  const user = await response.json();
  return user.name;
}

// Mock function to handle payment
async function handlePayment(userId: string, amount: number) {
  // Replace this with your actual payment API call
  console.log(`Transferring $${amount} to user ${userId}`);
  // Simulate API call
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export default function OrderForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
      productId: '',
      quantity: 1,
      totalPrice: 0,
      shippingAddress: '',
      status: 'Pending'
    }
  });

  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const userId = form.getValues('userId');
    if (userId) {
      fetchUserName(userId)
        .then(name => setUserName(name))
        .catch(error => console.error(error));
    }
  }, [form.watch('userId')]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  async function onPayButtonClick() {
    const { userId, totalPrice } = form.getValues();
    const profit = totalPrice * 0.8;
    try {
      await handlePayment(userId, profit);
      alert(`Successfully transferred $${profit} to user ${userId}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Order Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user ID" {...field} />
                    </FormControl>
                    <FormMessage />
                    {userName && <p className="text-sm text-gray-600">User Name: {userName}</p>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter total price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter shipping address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Not Paid">Not Paid</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('status') === 'Success' && (
              <Button type="button" onClick={onPayButtonClick} className="mt-4">
                Pay Seller
              </Button>
            )}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
