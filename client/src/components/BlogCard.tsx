import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Heart } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  readTime: number;
  likes?: number;
  publishedAt: string;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  coverImage,
  author,
  category,
  readTime,
  likes = 0,
  publishedAt,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`} data-testid={`link-blog-${id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all cursor-pointer h-full flex flex-col" data-testid={`card-blog-${id}`}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-4 right-4" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
        </div>
        <CardContent className="flex-1 flex flex-col p-6 gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold line-clamp-2 mb-2" data-testid={`text-title-${id}`}>
              {title}
            </h3>
            <p className="text-muted-foreground line-clamp-3 text-sm" data-testid={`text-excerpt-${id}`}>
              {excerpt}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium" data-testid={`text-author-${id}`}>{author.name}</span>
                <span className="text-xs text-muted-foreground" data-testid={`text-date-${id}`}>{publishedAt}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readTime} min
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {likes}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
