interface HeadingProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  icon: Icon
}) => {
  return (
    <div>
      {Icon && <Icon className="h-6 w-6 mb-2" />}
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
