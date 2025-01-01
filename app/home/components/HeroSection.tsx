import Head from 'next/head'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, Leaf, MessageSquare, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

export const HeroSection = () => {
  const stats = { plants: 10, posts: 10, users: 10 }

  return (
    <div className="w-full py-8 relative overflow-hidden">
      {/* Enhanced Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-100/30 via-purple-100/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/30 via-emerald-100/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Decorative Circles */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200/20 via-pink-200/20 to-rose-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-blue-200/20 via-cyan-200/20 to-teal-200/20 rounded-full blur-3xl" />
      
      <Head>
        <title>Plant GURU</title>
      </Head>

      <div className="container mx-auto relative">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/4 space-y-4"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-none overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[conic-gradient(from_225deg_at_top_right,_var(--tw-gradient-stops))] from-rose-500/20 via-purple-500/20 to-blue-500/20 rounded-full transform translate-x-16 -translate-y-16" />
              <CardContent className="p-6 space-y-6 relative">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Community Stats
                  </h3>
                </div>
                
                <div className="flex items-center space-x-4 group hover:transform hover:translate-x-2 transition-all duration-300">
                  <div className="p-3 rounded-full bg-gradient-to-br from-emerald-100 via-teal-200 to-cyan-100 group-hover:shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-300">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 text-transparent bg-clip-text">
                      {stats.plants}
                    </p>
                    <p className="text-sm text-gray-600">Plants Identified</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group hover:transform hover:translate-x-2 transition-all duration-300">
                  <div className="p-3 rounded-full bg-gradient-to-br from-violet-100 via-purple-200 to-fuchsia-100 group-hover:shadow-lg group-hover:shadow-purple-200/50 transition-all duration-300">
                    <MessageSquare className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-600 text-transparent bg-clip-text">
                      {stats.posts}
                    </p>
                    <p className="text-sm text-gray-600">Community Posts</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group hover:transform hover:translate-x-2 transition-all duration-300">
                  <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 via-pink-200 to-rose-100 group-hover:shadow-lg group-hover:shadow-rose-200/50 transition-all duration-300">
                    <Users className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 text-transparent bg-clip-text">
                      {stats.users}
                    </p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>

      
              </CardContent>
            </Card>

          
          </motion.div>

          {/* Search Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-3/4"
          >
            <Card className="bg-gradient-to-br from-white/80 via-white/60 to-transparent backdrop-blur-sm shadow-xl border-none overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[conic-gradient(from_45deg_at_top_right,_var(--tw-gradient-stops))] from-rose-200/30 via-purple-200/30 to-blue-200/30 rounded-full transform translate-x-32 -translate-y-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[conic-gradient(from_225deg_at_bottom_left,_var(--tw-gradient-stops))] from-blue-200/30 via-emerald-200/30 to-teal-200/30 rounded-full transform -translate-x-32 translate-y-32" />
              
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 transform hover:scale-105 transition-transform duration-300">
                      <Image 
                        src="/images/ic_logo.svg" 
                        alt="Logo" 
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-green-500 to-blue-600 text-transparent bg-clip-text">
                      Plant GURU
                    </h1>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="rounded-full hover:bg-gradient-to-r hover:from-primary/10 hover:to-green-200/20 transition-all duration-300"
                  >
                    Explore More
                  </Button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-green-200/20 to-blue-200/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search for a plant or ask a question..."
                      className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200/50 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {['Popular Plants', 'Care Tips', 'Community', 'Identification'].map((tag, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-primary/5 via-green-200/10 to-blue-200/5 hover:from-primary/10 hover:via-green-200/20 hover:to-blue-200/10 text-gray-600 transition-all duration-300"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
