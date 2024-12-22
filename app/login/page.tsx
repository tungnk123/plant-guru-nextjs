"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaStar, FaRocket, FaCogs } from 'react-icons/fa';
import LottieAnimation from '@/app/components/LottieAnimation';
import LogoWithBlackText from '@/app/components/navbar/LogoWithBlackText';
import animationData from '@/public/animations/lottie_login.json';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('userId', data.userId);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col justify-center w-full max-w-md p-10 bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl m-8 transition-all duration-500 hover:shadow-blue-200">
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <LogoWithBlackText />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Welcome back!
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="form-checkbox text-blue-500 rounded border-gray-300" />
              <span className="text-sm text-gray-600 group-hover:text-blue-500 transition-colors duration-300">
                Remember me
              </span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300">
              Forgot password?
            </a>
          </div>
          <Button 
            type="submit" 
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
          >
            Login
          </Button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-300">
              Sign up
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
        <div className="flex justify-center items-center w-full max-w-md transform hover:scale-105 transition-transform duration-500">
          <LottieAnimation animationData={animationData} />
        </div>
        <p className="mt-8 text-center max-w-md text-lg font-light leading-relaxed text-blue-100">
          Experience the best features and performance with our app. Join us and explore the possibilities!
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
