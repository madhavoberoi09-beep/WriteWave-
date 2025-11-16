import { useState } from "react";
import Navbar from "../Navbar";
import avatarImage from "@assets/generated_images/Female_author_avatar_portrait_8ceceda8.png";

export default function NavbarExample() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div>
      <Navbar 
        isLoggedIn={true}
        userAvatar={avatarImage}
        userName="Sarah Johnson"
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
      />
      <div className="p-8 text-center text-muted-foreground">
        <p>Navbar component with logged-in user</p>
      </div>
    </div>
  );
}
