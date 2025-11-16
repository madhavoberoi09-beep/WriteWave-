import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import BlogCard from "@/components/BlogCard";
import TrendingCard from "@/components/TrendingCard";
import { useTheme } from "@/components/ThemeProvider";
import { TrendingUp } from "lucide-react";

import heroCover from "@assets/generated_images/Hero_workspace_blog_cover_3da02892.png";
import techCover from "@assets/generated_images/Tech_blog_cover_abstract_23526e04.png";
import natureCover from "@assets/generated_images/Nature_blog_cover_landscape_1fe30be3.png";
import lifestyleCover from "@assets/generated_images/Lifestyle_blog_cover_office_24a195ba.png";
import writingCover from "@assets/generated_images/Writing_productivity_blog_cover_faaa2458.png";
import avatar1 from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";
import avatar2 from "@assets/generated_images/Male_author_avatar_portrait_746c4063.png";
import avatar3 from "@assets/generated_images/Professional_author_avatar_portrait_5bf855e1.png";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const featuredBlog = {
    id: "featured-1",
    title: "The Art of Modern Writing in the Digital Age",
    excerpt: "Explore how technology has transformed the way we write, share, and consume stories in today's connected world.",
    coverImage: heroCover,
    category: "Featured",
    readTime: 8,
    author: {
      name: "Sarah Johnson",
      avatar: avatar1
    }
  };

  const trendingBlogs = [
    { id: "t1", title: "How AI is Revolutionizing Content Creation", author: "Marcus Chen", readTime: 7, thumbnail: techCover, rank: 1 },
    { id: "t2", title: "The Future of Remote Work and Digital Nomads", author: "Emily Parker", readTime: 6, thumbnail: lifestyleCover, rank: 2 },
    { id: "t3", title: "Mastering the Art of Storytelling", author: "David Lee", readTime: 5, thumbnail: writingCover, rank: 3 },
  ];

  const recentBlogs = [
    {
      id: "1",
      title: "10 Essential Writing Tips for Aspiring Authors",
      excerpt: "Discover the fundamental techniques that will elevate your writing from good to exceptional. Learn how to craft compelling narratives.",
      coverImage: writingCover,
      author: { name: "Sarah Johnson", avatar: avatar1 },
      category: "Writing Tips",
      readTime: 5,
      likes: 42,
      publishedAt: "2 days ago"
    },
    {
      id: "2",
      title: "Building Scalable Web Applications with Modern Tech",
      excerpt: "A comprehensive guide to creating robust, maintainable applications using the latest frameworks and best practices.",
      coverImage: techCover,
      author: { name: "Alex Thompson", avatar: avatar2 },
      category: "Technology",
      readTime: 8,
      likes: 67,
      publishedAt: "3 days ago"
    },
    {
      id: "3",
      title: "Finding Peace in Nature: A Journey to Mindfulness",
      excerpt: "Explore the transformative power of connecting with nature and discovering inner peace through outdoor adventures.",
      coverImage: natureCover,
      author: { name: "Emma Wilson", avatar: avatar3 },
      category: "Lifestyle",
      readTime: 6,
      likes: 38,
      publishedAt: "5 days ago"
    },
    {
      id: "4",
      title: "The Remote Worker's Guide to Productivity",
      excerpt: "Maximize your efficiency and maintain work-life balance while working from anywhere in the world.",
      coverImage: lifestyleCover,
      author: { name: "Marcus Chen", avatar: avatar2 },
      category: "Business",
      readTime: 7,
      likes: 54,
      publishedAt: "1 week ago"
    },
    {
      id: "5",
      title: "Design Principles for Modern User Interfaces",
      excerpt: "Learn the core principles that make digital products intuitive, accessible, and delightful to use.",
      coverImage: techCover,
      author: { name: "Lisa Anderson", avatar: avatar1 },
      category: "Design",
      readTime: 9,
      likes: 71,
      publishedAt: "1 week ago"
    },
    {
      id: "6",
      title: "Sustainable Living: Small Changes, Big Impact",
      excerpt: "Simple, practical steps you can take today to reduce your environmental footprint and live more sustainably.",
      coverImage: natureCover,
      author: { name: "David Lee", avatar: avatar3 },
      category: "Lifestyle",
      readTime: 5,
      likes: 45,
      publishedAt: "2 weeks ago"
    }
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
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <HeroSection blog={featuredBlog} />
        
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingBlogs.map((blog) => (
              <TrendingCard key={blog.id} {...blog} />
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <CategoryFilter 
            categories={["Technology", "Writing Tips", "Lifestyle", "Travel", "Business", "Design"]}
          />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
        </section>
      </main>
      
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 WriteWave. Built for writers, by writers.</p>
        </div>
      </footer>
    </div>
  );
}
