interface ButtonProps {
    title: string;
    subtitle: string;
    icon: string;
    onClick: ()=>void
}

const ButtonCard: React.FC<ButtonProps> = ({ title, subtitle, icon, onClick }) => {
    return (
        <button className="flex flex-col items-center p-10 border rounded-3xl shadow-md bg-green1 hover:bg-green2 transition"
        onClick={onClick}>
            <img
              src={icon}
              className="aspect-square h-28 mb-5"
            />
            <h3 className="font-bold text-[24px] font-inter">{title}</h3>
            <p className="font-normal text-[16px] font-inter">{subtitle}</p>
        </button>
    );
};

export default ButtonCard;