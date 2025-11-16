import CommentSection from "../CommentSection";
import avatar1 from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";
import avatar2 from "@assets/generated_images/Male_author_avatar_portrait_746c4063.png";
import avatar3 from "@assets/generated_images/Professional_author_avatar_portrait_5bf855e1.png";

export default function CommentSectionExample() {
  const mockComments = [
    {
      id: "1",
      author: { name: "Emma Wilson", avatar: avatar1 },
      content: "Great article! This really helped me understand the concepts better. I've been struggling with this for weeks.",
      timestamp: "2 hours ago",
      likes: 12,
      replies: [
        {
          id: "1-1",
          author: { name: "David Lee", avatar: avatar2 },
          content: "I agree! The examples were particularly helpful.",
          timestamp: "1 hour ago",
          likes: 5,
        }
      ]
    },
    {
      id: "2",
      author: { name: "Alex Martinez", avatar: avatar3 },
      content: "Thanks for sharing this. Would love to see more content like this!",
      timestamp: "3 hours ago",
      likes: 8,
    }
  ];

  return (
    <div className="p-8 max-w-3xl">
      <CommentSection
        comments={mockComments}
        currentUserAvatar={avatar1}
      />
    </div>
  );
}
