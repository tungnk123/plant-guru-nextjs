import Link from 'next/link';
import { useState, useRef } from 'react';
import { Upload, Loader2, Sprout, Leaf, Cloud, Droplets } from 'lucide-react';
import Image from 'next/image';
import LottieAnimation from '@/app/components/LottieAnimation';
import uploadAnimation from "@/public/animations/lottie_upload.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { SP } from 'next/dist/shared/lib/utils';

const PlantIdentifier = () => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [plantInfo, setPlantInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await identifyPlant(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await identifyPlant(file);
    }
  };

  const identifyPlant = async (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = error => reject(error);
    });
    reader.readAsDataURL(file);

    try {
      const base64Image = await base64Promise;

      const apiKey = 'URWBmEBcg06oPXxGwSF8gE5vqYIosQ7x30gG2I98DOd9dADPzM';
      const apiUrl = 'https://plant.id/api/v3/identification';
      const params = new URLSearchParams({
        details:
          'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering',
        language: 'en',
      });

      const fullApiUrl = `${apiUrl}?${params.toString()}`;

      const requestBody = {
        images: [base64Image],
        latitude: 14.0583,
        longitude: 108.2772,
        similar_images: true,
      };

      const response = await fetch(fullApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to identify the plant via Plant.id API');
      }

      const data = await response.json();
      setPlantInfo(data);
    } catch (error) {
      console.error('Error calling Plant.id API directly:', error);
      alert('Failed to identify plant directly. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-green-100 via-blue-100 to-purple-100 p-8">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-full h-full max-w-5xl bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <Card className="border-slate-200/60 shadow-xl backdrop-blur-sm bg-white/70">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="space-y-2">
              <Badge variant="outline" className="px-4 py-1 border-green-200 text-green-700">
                AI-Powered Plant Recognition
              </Badge>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-transparent bg-clip-text flex items-center justify-center gap-3 pt-2">
                <Sprout className="h-8 w-8 text-green-500" />
                Plant Identifier
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Instantly identify plants, flowers, and trees. Explore gardening tips,
                detailed care guides, and the plant world around you.
              </CardDescription>
            </div>
            
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700">
                <Leaf className="h-4 w-4" />
                <span>10,000+ Plants</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700">
                <Cloud className="h-4 w-4" />
                <span>Free Upload</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700">
                <Droplets className="h-4 w-4" />
                <span>Care Guides</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="flex w-full justify-center items-start gap-8">
              {/* Upload Section */}
              <motion.div
                layout
                className={`transition-all duration-500 ${plantInfo ? 'w-1/3' : 'w-2/5'}`}
              >
                <Card className="border-slate-200/60 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div
                      className="relative group cursor-pointer rounded-lg border-2 border-dashed border-slate-300 hover:border-green-500/50 transition-all"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 h-[300px] w-full relative rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-green-50 group-hover:shadow-md transition-all">
                          {image ? (
                            <Image
                              src={image}
                              alt="Uploaded"
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                              <div className="w-48 h-48">
                                <LottieAnimation
                                  animationData={uploadAnimation}
                                  loop={true}
                                />
                              </div>
                              <p className="text-sm text-slate-500">Drop your image here</p>
                            </div>
                          )}
                        </div>
                        <Separator className="my-6" />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="default" 
                                className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                                onClick={handleButtonClick}
                              >
                                <Upload className="h-4 w-4" />
                                Upload an image
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to select an image</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results Section */}
              <AnimatePresence>
                {plantInfo && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1"
                  >
                    <Card className="border-slate-200/60 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl text-green-700 flex items-center gap-2">
                          <Sprout className="h-5 w-5" />
                          Identification Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {plantInfo.result.classification.suggestions.slice(0, 5).map(
                          (suggestion: any, index: number) => (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              key={index}
                            >
                              <Button
                                variant="outline"
                                className="w-full h-auto p-4 hover:bg-green-50/50 hover:border-green-200 transition-all"
                                onClick={() =>
                                  window.location.href = `/plant-detail/?data=${encodeURIComponent(
                                    JSON.stringify({
                                      name: suggestion.name || 'Unknown Plant',
                                      description: suggestion.details?.description?.value || 'No description available.',
                                      common_names: suggestion.details?.common_names || [],
                                      synonyms: suggestion.details?.synonyms || [],
                                      taxonomy: suggestion.details?.taxonomy || {},
                                      image: suggestion.details?.image?.value || '',
                                      url: suggestion.details?.url || '',
                                      edible_parts: suggestion.details?.edible_parts || [],
                                      gbif_id: suggestion.details?.gbif_id || 0,
                                      inaturalist_id: suggestion.details?.inaturalist_id || 0,
                                      rank: suggestion.details?.rank || '',
                                      probability: suggestion.probability || 0,
                                    })
                                  )}`
                                }
                              >
                                <div className="flex items-center w-full gap-4">
                                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-slate-200">
                                    <Image
                                      src={suggestion.details?.image?.value || '/images/placeholder.png'}
                                      alt={suggestion.name || 'Unknown'}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="font-semibold text-green-700">{suggestion.name || 'Unknown Plant'}</p>
                                    <Progress 
                                      value={suggestion.probability * 100} 
                                      className="h-2 mt-2 bg-slate-100"
                                    />
                                  </div>
                                  <Badge variant="outline" className="text-lg font-bold text-green-600 border-green-200">
                                    {(suggestion.probability * 100).toFixed(0)}%
                                  </Badge>
                                </div>
                              </Button>
                            </motion.div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
          >
            <Card className="border-slate-200/60 shadow-lg">
              <CardContent className="flex items-center gap-3 p-6">
                <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                <p className="text-lg text-green-700">Identifying the plant...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlantIdentifier;
