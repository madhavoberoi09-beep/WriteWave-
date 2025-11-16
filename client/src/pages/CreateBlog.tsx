import { useState } from "react";
import Navbar from "@/components/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Save, Send } from "lucide-react";
import avatar1 from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";

export default function CreateBlog() {
  const { theme, toggleTheme } = useTheme();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const handleSave = (publish: boolean) => {
    console.log("Saving blog:", {
      title,
      excerpt,
      content,
      category,
      status: publish ? "published" : "draft",
      coverImage
    });
  };

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
            <h1 className="text-3xl font-bold">Create New Article</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                className="gap-2"
                data-testid="button-save-draft"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                className="gap-2"
                data-testid="button-publish"
              >
                <Send className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold h-14 mt-2"
                  data-testid="input-title"
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt" className="text-lg font-semibold">Excerpt</Label>
                <Input
                  id="excerpt"
                  placeholder="Brief description of your article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-2"
                  data-testid="input-excerpt"
                />
              </div>
              
              <div>
                <Label className="text-lg font-semibold mb-2 block">Content</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your story..."
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coverImage ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => setCoverImage(null)}
                          data-testid="button-remove-cover"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload cover image
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category" className="mt-2" data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="writing">Writing Tips</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publish-toggle">Publish immediately</Label>
                    <Switch
                      id="publish-toggle"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                      data-testid="switch-publish"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
