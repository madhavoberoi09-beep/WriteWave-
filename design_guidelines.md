# WriteWave Design Guidelines

## Design Approach: Reference-Based (Medium-Inspired)

WriteWave draws inspiration from Medium's clean, content-first approach while establishing its own modern identity. The design prioritizes readability, elegant simplicity, and seamless content discovery.

## Typography System

**Font Families:**
- Primary: Inter or System UI for interface elements
- Content: Georgia or Charter for blog body text (serif for enhanced readability)
- Headings: Inter or System UI (sans-serif for contrast)

**Scale:**
- Hero Headlines: text-5xl to text-6xl (font-bold)
- Page Titles: text-4xl (font-bold)
- Section Headers: text-3xl (font-semibold)
- Blog Titles (cards): text-xl to text-2xl (font-bold)
- Body Text: text-base to text-lg (line-height-relaxed for blog content)
- Captions/Meta: text-sm (font-medium)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20, py-24
- Element gaps: gap-4, gap-6, gap-8

**Grid Structure:**
- Max content width: max-w-7xl for site container
- Blog content: max-w-2xl (optimal reading width ~700px)
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard layouts: Sidebar (w-64) + Main content (flex-1)

## Core Pages & Layouts

### Homepage
- **Hero Section:** Full-width featured blog with large cover image (h-[500px] to h-[600px]), overlaid title, author info, and category tag. Subtle gradient overlay for text readability. CTA: "Read Story" button with backdrop-blur-md background.
- **Trending Section:** Horizontal scrollable card carousel (3-4 blogs visible) with compact cards showing thumbnail, title, author, read time
- **Recent Blogs Grid:** 3-column grid (mobile: 1-col, tablet: 2-col) with medium-sized cards including cover image, title, excerpt (2-3 lines), author avatar, publish date, category tag
- **Category Filter:** Horizontal pill-style buttons (sticky on scroll) for quick filtering

### Blog Detail Page
- **Header:** Centered layout with title (text-4xl to text-5xl, max-w-3xl), subtitle/excerpt, author card (avatar + name + follow button), publish date, read time, category tags
- **Cover Image:** Full-width hero image (aspect-ratio-[21/9] or h-[400px])
- **Content Area:** Single column (max-w-2xl, mx-auto) with generous line spacing (leading-8), proper paragraph margins (mb-6)
- **Engagement Bar:** Sticky side rail (hidden on mobile, visible on lg+) with like count, comment count, share buttons
- **Comments Section:** Nested threading with indentation (pl-8, pl-12 for replies), avatar + name + timestamp for each comment, reply button, "Load more replies" for deep threads
- **Related Blogs:** 3-column grid at bottom with similar styling to homepage cards

### Author Dashboard
- **Sidebar Navigation:** Fixed left sidebar (w-64) with menu items: My Blogs, Create New, Drafts, Published, Analytics
- **Main Content:** 
  - Stats cards at top (3-4 cards showing total views, likes, comments, followers)
  - Blog management table with columns: Cover (thumbnail), Title, Status (Draft/Published badge), Views, Likes, Actions (Edit/Delete icons)
  - Pagination at bottom

### Admin Dashboard
- Similar layout to Author Dashboard
- Additional sections: User Management (table with user details, role badges, action buttons), Content Moderation (pending approvals with approve/reject actions)

### Create/Edit Blog
- **Rich Text Editor:** Full-width TipTap editor with floating toolbar
- **Sidebar Panel:** (right side, w-80) with:
  - Cover image upload (large preview with drag-drop zone)
  - Title input (large, prominent)
  - Slug preview/edit (smaller, below title)
  - Category selector (dropdown)
  - Tags input (multi-select)
  - Status toggle (Draft/Publish)
  - Action buttons (Save Draft, Publish)

### User Profile
- **Header Card:** Large cover banner (h-48) with avatar overlapping at bottom-center, name (text-3xl), bio (text-center, max-w-2xl), follow/edit button, stats row (Blogs • Followers • Following)
- **Tabs:** Horizontal tabs for "Published Blogs" and "About"
- **Blog Grid:** Same 3-column card layout as homepage

### Auth Pages (Login/Register)
- **Layout:** Split screen on desktop (image/illustration left 40%, form right 60%), stacked on mobile
- **Form Container:** Centered card (max-w-md) with ample padding (p-8, p-10)
- **Inputs:** Large, spacious text fields (h-12), proper labels above inputs
- **Branding:** Logo and tagline at top of form

## Component Library

**Blog Cards:**
- Vertical cards with cover image (aspect-ratio-[16/9]), title (2-line clamp), excerpt (3-line clamp), author row (avatar + name + date), category tag (top-right absolute position)
- Hover: Subtle scale (scale-105) and shadow increase

**Buttons:**
- Primary: Rounded-full, px-6, py-3, font-semibold
- Secondary: Same size, outlined style
- Icon buttons: Rounded-full, p-2 or p-3
- Buttons over images: backdrop-blur-md, semi-transparent background

**Author Card:**
- Horizontal flex layout: avatar (rounded-full, w-10 to w-12) + name (font-semibold) + metadata (text-sm)
- Include follow button when applicable

**Comment Component:**
- Nested structure with left border (border-l-2) for visual threading
- Avatar + name + timestamp in header
- Comment text body
- Action row: Like • Reply • More

**Navigation:**
- Top navbar: Logo left, search center (expandable input), user menu right
- Sticky on scroll with subtle shadow
- Mobile: Hamburger menu

**Search Bar:**
- Expandable input (focus: w-full transition), icon-left, clear button when active

## Image Strategy

**Required Images:**
1. **Homepage Hero:** Large featured blog cover (landscape, 1920x800px recommended)
2. **Blog Cover Images:** Every blog requires a cover (16:9 ratio preferred, minimum 1200x675px)
3. **Author Avatars:** Circular profile images throughout (various sizes: 40px, 48px, 64px, 96px)
4. **Trending Thumbnails:** Smaller blog covers for trending carousel (400x225px)
5. **Category Illustrations:** Optional decorative images for category pages
6. **Auth Page Visual:** Illustration or photo for login/register split screen (800x1000px portrait)

Use placeholder services (Unsplash API) or Lorem Picsum for demo images with relevant keywords (writing, coffee, workspace, books, etc.)

## Animations (Minimal)

- Page transitions: Fade-in only (no complex animations)
- Card hover: Subtle scale + shadow
- Button interactions: Built-in Shadcn/UI states
- Skeleton loaders: Pulse animation for loading states
- NO scroll-triggered animations, parallax, or complex motion

## Accessibility & Quality

- All interactive elements: min-h-[44px] (touch targets)
- Form inputs: Consistent height h-10 to h-12, clear labels
- Focus states: Visible ring-2 ring-offset-2
- Proper heading hierarchy (h1 → h6)
- Alt text for all images
- ARIA labels for icon-only buttons

## Mobile Responsiveness

- Stack all multi-column layouts to single column on mobile
- Hide sidebar navigation behind hamburger menu
- Floating action button (bottom-right) for "Create Blog" on mobile
- Sticky header condensed on mobile (logo + hamburger only)
- Card padding reduced: p-4 on mobile vs p-6 on desktop
- Typography scales down one size on mobile (text-4xl → text-3xl)

This design creates a sophisticated, content-focused experience that honors Medium's readability principles while establishing WriteWave's distinct modern identity.