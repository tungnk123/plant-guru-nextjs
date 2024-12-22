"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaStar, FaRocket, FaCogs, FaEye, FaEyeSlash } from 'react-icons/fa';
import LottieAnimation from '@/app/components/LottieAnimation';
import LogoWithBlackText from '@/app/components/navbar/LogoWithBlackText';
import animationData from '@/public/animations/lottie_login.json';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/actions/loginUser';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      
      if (data?.userId) {
        localStorage.setItem('userId', data.userId);
        toast.success('Login successful!');
        router.push('/home');
      } else {
        setError('Invalid email or password');
        setPassword('');
      }
    } catch (error: any) {
      setError('An unexpected error occurred');
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
          Welcome back!
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-4 border ${error ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30`}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-4 border ${error ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 hover:border-blue-500/30 pr-12`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="form-checkbox text-blue-500 rounded border-gray-300"
                disabled={isLoading}
              />
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
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : 'Login'}
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
