import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface HeroSectionProps {
  blog: {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: string;
    readTime: number;
    author: {
      name: string;
      avatar?: string;
    };
  };
}

export default function HeroSection({ blog }: HeroSectionProps) {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-lg">
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
        <div className="max-w-3xl space-y-4">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-white/30" data-testid="badge-category">
            {blog.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" data-testid="text-hero-title">
            {blog.title}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 line-clamp-2" data-testid="text-hero-excerpt">
            {blog.excerpt}
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white/30">
                <AvatarImage src={blog.author.avatar} />
                <AvatarFallback className="bg-white/20 text-white">{blog.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-medium" data-testid="text-author">
                  {blog.author.name}
                </span>
                <span className="text-white/70 text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {blog.readTime} min read
                </span>
              </div>
            </div>
          </div>
          
          <Link href={`/blog/${blog.id}`} data-testid="link-read-story">
            <Button 
              size="lg" 
              className="backdrop-blur-md bg-white/90 hover:bg-white text-black gap-2 mt-4"
            >
              Read Story
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
