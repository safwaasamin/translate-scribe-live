import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  path: string;
  description: string;
}

export const DashboardCard = ({ title, icon: Icon, path, description }: DashboardCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      className="card-gradient shadow-card cursor-pointer p-6 transition-smooth hover:shadow-lg hover:scale-105 border border-border/50"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
};
