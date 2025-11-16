import { useState } from "react";
import { useRoute } from "wouter";
import Navbar from "@/components/Navbar";
import AuthorCard from "@/components/AuthorCard";
import CommentSection from "@/components/CommentSection";
import BlogCard from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Heart, Share2, Bookmark, Clock } from "lucide-react";

import heroCover from "@assets/generated_images/Hero_workspace_blog_cover_3da02892.png";
import techCover from "@assets/generated_images/Tech_blog_cover_abstract_23526e04.png";
import natureCover from "@assets/generated_images/Nature_blog_cover_landscape_1fe30be3.png";
import avatar1 from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";
import avatar2 from "@assets/generated_images/Male_author_avatar_portrait_746c4063.png";
import avatar3 from "@assets/generated_images/Professional_author_avatar_portrait_5bf855e1.png";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  const { theme, toggleTheme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(42);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const mockComments = [
    {
      id: "1",
      author: { name: "Emma Wilson", avatar: avatar2 },
      content: "Great article! This really helped me understand the concepts better. I've been struggling with this for weeks and your explanations made everything click.",
      timestamp: "2 hours ago",
      likes: 12,
      replies: [
        {
          id: "1-1",
          author: { name: "David Lee", avatar: avatar3 },
          content: "I agree! The examples were particularly helpful.",
          timestamp: "1 hour ago",
          likes: 5,
        }
      ]
    },
    {
      id: "2",
      author: { name: "Alex Martinez", avatar: avatar3 },
      content: "Thanks for sharing this. Would love to see more content like this in the future!",
      timestamp: "3 hours ago",
      likes: 8,
    }
  ];

  const relatedBlogs = [
    {
      id: "r1",
      title: "Advanced Writing Techniques for Professionals",
      excerpt: "Take your writing to the next level with these advanced strategies used by professional authors.",
      coverImage: techCover,
      author: { name: "Marcus Chen", avatar: avatar2 },
      category: "Writing Tips",
      readTime: 7,
      likes: 34,
      publishedAt: "1 week ago"
    },
    {
      id: "r2",
      title: "The Science of Storytelling",
      excerpt: "Understanding the psychological principles behind captivating narratives and engaging content.",
      coverImage: natureCover,
      author: { name: "Lisa Anderson", avatar: avatar1 },
      category: "Writing Tips",
      readTime: 6,
      likes: 28,
      publishedAt: "2 weeks ago"
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar 
        isLoggedIn={true}
        userAvatar={avatar1}
        userName="Sarah Johnson"
        isDark={theme === "dark"}
        onThemeToggle={toggleTheme}
      />
      
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="mb-4" data-testid="badge-category">Writing Tips</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-title">
              The Art of Modern Writing in the Digital Age
            </h1>
            <p className="text-xl text-muted-foreground mb-6" data-testid="text-blog-excerpt">
              Explore how technology has transformed the way we write, share, and consume stories in today's connected world.
            </p>
            
            <div className="flex items-center justify-between py-4 border-y">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span data-testid="text-publish-date">March 15, 2024</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  8 min read
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={handleLike}
                  data-testid="button-like"
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  {likes}
                </Button>
                <Button
                  variant={bookmarked ? "default" : "outline"}
                  size="icon"
                  onClick={() => setBookmarked(!bookmarked)}
                  data-testid="button-bookmark"
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" data-testid="button-share">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <img
            src={heroCover}
            alt="Blog cover"
            className="w-full h-[400px] object-cover rounded-lg mb-8"
            data-testid="img-cover"
          />
          
          <div className="prose prose-lg max-w-none mb-12 font-serif" data-testid="content-blog-body">
            <p className="lead">
              In an era where technology permeates every aspect of our lives, the art of writing has undergone 
              a remarkable transformation. What was once confined to paper and typewriters has now evolved into 
              a dynamic, interconnected ecosystem of digital platforms and tools.
            </p>

            <h2>The Digital Revolution</h2>
            <p>
              The shift from traditional to digital writing has democratized content creation. Anyone with an 
              internet connection can now share their thoughts with a global audience. This accessibility has 
              sparked a renaissance in creative expression, giving voice to perspectives that might have 
              previously gone unheard.
            </p>

            <h2>Tools and Techniques</h2>
            <p>
              Modern writers have access to an unprecedented array of tools. From collaborative platforms to 
              AI-powered editing assistants, technology has become an invaluable partner in the creative process. 
              However, the core principles of good writing remain unchanged: clarity, authenticity, and connection 
              with the reader.
            </p>

            <blockquote>
              "The best writing speaks to the human experience, regardless of the medium through which it's shared."
            </blockquote>

            <h2>Building Your Audience</h2>
            <p>
              In the digital age, writing is just one part of the equation. Understanding your audience, 
              engaging with readers, and building a community around your work have become essential skills 
              for modern writers. Social media, newsletters, and interactive platforms offer new ways to 
              connect with readers and foster meaningful conversations.
            </p>
          </div>
          
          <div className="mb-12">
            <AuthorCard
              name="Sarah Johnson"
              avatar={avatar1}
              bio="Tech writer and content creator sharing insights on modern development practices and design principles."
              followers={2453}
              articles={47}
            />
          </div>
          
          <div className="mb-12">
            <CommentSection comments={mockComments} currentUserAvatar={avatar1} />
          </div>
          
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBlogs.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>
          </section>
        </article>
      </main>
      
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 WriteWave. Built for writers, by writers.</p>
        </div>
      </footer>
    </div>
  );
}
