import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart } from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  currentUserAvatar?: string;
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className={`${depth > 0 ? 'ml-12 border-l-2 pl-4' : ''}`} data-testid={`comment-${comment.id}`}>
      <div className="flex gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm" data-testid={`text-comment-author-${comment.id}`}>
              {comment.author.name}
            </span>
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
          </div>
          
          <p className="text-sm mb-2" data-testid={`text-comment-content-${comment.id}`}>
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button 
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              data-testid={`button-like-comment-${comment.id}`}
              onClick={() => console.log("Like comment:", comment.id)}
            >
              <Heart className="h-3 w-3" />
              {comment.likes}
            </button>
            <button 
              className="hover:text-foreground transition-colors"
              onClick={() => setShowReply(!showReply)}
              data-testid={`button-reply-comment-${comment.id}`}
            >
              Reply
            </button>
          </div>
          
          {showReply && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                className="min-h-[60px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                data-testid={`textarea-reply-${comment.id}`}
              />
              <Button 
                size="sm"
                onClick={() => {
                  console.log("Reply submitted:", replyText);
                  setReplyText("");
                  setShowReply(false);
                }}
                data-testid={`button-submit-reply-${comment.id}`}
              >
                Reply
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function CommentSection({ comments, currentUserAvatar }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Comments ({comments.length})
      </h3>
      
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUserAvatar} />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder="What are your thoughts?"
            className="min-h-[80px]"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            data-testid="textarea-new-comment"
          />
          <Button
            onClick={() => {
              console.log("Comment submitted:", newComment);
              setNewComment("");
            }}
            data-testid="button-submit-comment"
          >
            Post
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
