import Navbar from "@/components/Navbar";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageSquare, Edit, Trash2, PenSquare } from "lucide-react";
import { Link } from "wouter";
import avatar1 from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";
import writingCover from "@assets/generated_images/Writing_productivity_blog_cover_faaa2458.png";
import techCover from "@assets/generated_images/Tech_blog_cover_abstract_23526e04.png";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  const stats = [
    { label: "Total Views", value: "12,458", icon: Eye },
    { label: "Total Likes", value: "1,234", icon: Heart },
    { label: "Comments", value: "567", icon: MessageSquare },
    { label: "Articles", value: "47", icon: PenSquare },
  ];

  const myBlogs = [
    {
      id: "1",
      title: "The Art of Modern Writing in the Digital Age",
      status: "published",
      views: 2453,
      likes: 142,
      comments: 28,
      thumbnail: writingCover,
      publishedAt: "2 days ago"
    },
    {
      id: "2",
      title: "10 Essential Tips for Better Productivity",
      status: "draft",
      views: 0,
      likes: 0,
      comments: 0,
      thumbnail: techCover,
      publishedAt: "Draft"
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your articles and track performance</p>
            </div>
            <Link href="/create" data-testid="link-create-article">
              <Button className="gap-2">
                <PenSquare className="h-4 w-4" />
                New Article
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>My Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover-elevate"
                    data-testid={`card-my-blog-${blog.id}`}
                  >
                    <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate" data-testid={`text-blog-title-${blog.id}`}>
                          {blog.title}
                        </h3>
                        <Badge variant={blog.status === "published" ? "default" : "secondary"}>
                          {blog.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {blog.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {blog.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {blog.comments}
                        </span>
                        <span>{blog.publishedAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" data-testid={`button-edit-${blog.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" data-testid={`button-delete-${blog.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
