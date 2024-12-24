"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaStar, FaRocket, FaCogs, FaEye, FaEyeSlash } from 'react-icons/fa';
import LottieAnimation from '@/app/components/LottieAnimation';
import LogoWithBlackText from '@/app/components/navbar/LogoWithBlackText';
import animationData from '@/public/animations/lottie_login.json';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { addUser } from '@/app/admin/api/user';

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await addUser(
        formData.email,
        formData.password,
        formData.name,
        "default-avatar.png"
      );

      if (response) {
        toast.success('Registration successful!');
        router.push('/login');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'An unexpected error occurred');
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col justify-center w-full max-w-md p-10 bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl m-8 transition-all duration-500 hover:shadow-blue-200">
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <LogoWithBlackText />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Create Account
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30 pr-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30 pr-12"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-300"
            >
              Login
            </a>
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-violet-600 text-white p-12">
        <div className="flex space-x-8 mb-8">
          <FaStar size={40} className="animate-pulse text-yellow-300" />
          <FaRocket size={40} className="animate-bounce text-blue-300" />
          <FaCogs size={40} className="animate-spin-slow text-purple-300" />
        </div>
        <div className="flex justify-center items-center w-full max-w-md">
          <LottieAnimation animationData={animationData} />
        </div>
        <p className="mt-8 text-center max-w-md text-lg font-light leading-relaxed text-blue-100">
          Join our community today and start your journey with us!
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
