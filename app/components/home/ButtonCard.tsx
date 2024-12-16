import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ButtonProps {
    title: string;
    subtitle: string;
    icon: string;
    onClick: ()=>void
}

const ButtonCard: React.FC<ButtonProps> = ({ title, subtitle, icon, onClick }) => {
    return (
        <Button className="flex flex-col items-center p-5 border h-fit text-black rounded-3xl shadow-md bg-green1 hover:bg-green2 transition"
        onClick={onClick}>
            <Image
              src={icon}
              className="aspect-square mb-5"
              alt=""
              height={60}
              width={60}
            />
            <h3 className="font-bold text-[24px] font-inter">{title}</h3>
            <p className="font-normal text-[16px] font-inter">{subtitle}</p>
        </Button>
    );
};

export default ButtonCard;