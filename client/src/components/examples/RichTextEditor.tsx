import { useState } from "react";
import RichTextEditor from "../RichTextEditor";

export default function RichTextEditorExample() {
  const [content, setContent] = useState("");

  return (
    <div className="p-8">
      <h3 className="text-xl font-bold mb-4">Rich Text Editor</h3>
      <RichTextEditor
        content={content}
        onChange={(newContent) => {
          setContent(newContent);
          console.log("Content updated:", newContent);
        }}
        placeholder="Write something amazing..."
      />
    </div>
  );
}
