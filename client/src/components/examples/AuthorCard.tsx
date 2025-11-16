import AuthorCard from "../AuthorCard";
import authorAvatar from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";

export default function AuthorCardExample() {
  return (
    <div className="p-8 max-w-2xl">
      <AuthorCard
        name="Sarah Johnson"
        avatar={authorAvatar}
        bio="Tech writer and content creator sharing insights on modern development practices and design principles."
        followers={2453}
        articles={47}
      />
    </div>
  );
}
