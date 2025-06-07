
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: string;
  questionsCount: number;
  estimatedTime: string;
  onClick: () => void;
}

const CategoryCard = ({ 
  title, 
  description, 
  icon: Icon, 
  difficulty, 
  questionsCount, 
  estimatedTime, 
  onClick 
}: CategoryCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-card/80 backdrop-blur border-border hover:border-primary/40"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors" />
          <Badge className={`${getDifficultyColor(difficulty)} border`}>
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="text-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{questionsCount} questions</span>
          <span>{estimatedTime}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;