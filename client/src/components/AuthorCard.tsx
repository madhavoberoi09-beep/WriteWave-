import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface AuthorCardProps {
  name: string;
  avatar?: string;
  bio: string;
  followers: number;
  articles: number;
}

export default function AuthorCard({ name, avatar, bio, followers, articles }: AuthorCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1" data-testid="text-author-name">{name}</h3>
            <p className="text-sm text-muted-foreground mb-3" data-testid="text-author-bio">{bio}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span data-testid="text-followers">{followers} followers</span>
              <span data-testid="text-articles">{articles} articles</span>
            </div>
            
            <Button size="sm" className="gap-2" data-testid="button-follow">
              <UserPlus className="h-4 w-4" />
              Follow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
