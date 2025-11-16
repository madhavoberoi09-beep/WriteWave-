import HeroSection from "../HeroSection";
import heroCover from "@assets/generated_images/Hero_workspace_blog_cover_3da02892.png";
import authorAvatar from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";

export default function HeroSectionExample() {
  return (
    <div className="p-8">
      <HeroSection
        blog={{
          id: "featured-1",
          title: "The Art of Modern Writing in the Digital Age",
          excerpt: "Explore how technology has transformed the way we write, share, and consume stories in today's connected world.",
          coverImage: heroCover,
          category: "Featured",
          readTime: 8,
          author: {
            name: "Sarah Johnson",
            avatar: authorAvatar
          }
        }}
      />
    </div>
  );
}
