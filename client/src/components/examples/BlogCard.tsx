import BlogCard from "../BlogCard";
import coverImage from "@assets/generated_images/Hero_workspace_blog_cover_3da02892.png";
import authorAvatar from "@assets/generated_images/Male_author_avatar_portrait_746c4063.png";

export default function BlogCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <BlogCard
        id="1"
        title="10 Tips for Better Writing: A Comprehensive Guide"
        excerpt="Discover the essential techniques that will transform your writing from good to great. Learn how to craft compelling narratives that engage your readers."
        coverImage={coverImage}
        author={{
          name: "Alex Thompson",
          avatar: authorAvatar
        }}
        category="Writing Tips"
        readTime={5}
        likes={42}
        publishedAt="2 days ago"
      />
    </div>
  );
}
