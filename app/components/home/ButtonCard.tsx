import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";

interface ButtonProps {
    title: string;
    subtitle: string;
    icon: string;
    onClick: () => void;
}

const ButtonCard: React.FC<ButtonProps> = ({ 
    title, 
    subtitle, 
    icon, 
    onClick,
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card 
                onClick={onClick}
                className="relative group cursor-pointer overflow-hidden border-none"
            >
                {/* Base Green Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50/40 backdrop-blur-sm" />
                
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 
                    opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Content */}
                <div className="relative p-8 flex flex-col items-center">
                    {/* Icon Container */}
                    <div className="relative w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-100 
                            opacity-50 rounded-full blur-xl group-hover:opacity-75 transition-opacity duration-300" />
                        <Image
                            src={icon}
                            alt={title}
                            fill
                            className="object-contain p-1 drop-shadow-xl"
                        />
                    </div>

                    {/* Title with Green Gradient */}
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 
                        bg-clip-text text-transparent text-center group-hover:scale-105 transition-transform duration-300">
                        {title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-center text-sm leading-relaxed max-w-[300px]">
                        {subtitle}
                    </p>

                    {/* Hover Button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 
                        transform translate-y-2 group-hover:translate-y-0">
                        <Button 
                            variant="ghost"
                            className="rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white 
                                hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg 
                                hover:shadow-green-200/50 transition-all duration-300"
                        >
                            Explore
                        </Button>
                    </div>

                    {/* Bottom Gradient Line */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 
                        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 via-emerald-200/30 to-teal-200/30 
                    rounded-full blur-2xl transform translate-x-12 -translate-y-12 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-200/30 via-emerald-200/30 to-teal-200/30 
                    rounded-full blur-2xl transform -translate-x-12 translate-y-12 group-hover:opacity-75 transition-opacity duration-300" />
            </Card>
        </motion.div>
    );
};

export default ButtonCard;