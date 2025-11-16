import TrendingCard from "../TrendingCard";
import thumbnail from "@assets/generated_images/Tech_blog_cover_abstract_23526e04.png";

export default function TrendingCardExample() {
  return (
    <div className="p-8 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl font-bold">Trending</span>
      </div>
      <TrendingCard
        id="trending-1"
        title="How AI is Revolutionizing Content Creation"
        author="Marcus Chen"
        readTime={7}
        thumbnail={thumbnail}
        rank={1}
      />
    </div>
  );
}
