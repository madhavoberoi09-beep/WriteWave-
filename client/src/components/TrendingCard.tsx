import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TrendingCardProps {
  id: string;
  title: string;
  author: string;
  readTime: number;
  thumbnail: string;
  rank: number;
}

export default function TrendingCard({ id, title, author, readTime, thumbnail, rank }: TrendingCardProps) {
  return (
    <Link href={`/blog/${id}`} data-testid={`link-trending-${id}`}>
      <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden" data-testid={`card-trending-${id}`}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex items-start">
              <Badge variant="secondary" className="rounded-full h-8 w-8 flex items-center justify-center p-0">
                <span className="text-sm font-bold">{rank}</span>
              </Badge>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold line-clamp-2 mb-1" data-testid={`text-title-${id}`}>
                {title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {author} · {readTime} min read
              </p>
            </div>
            
            <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
