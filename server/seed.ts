import { db } from "./db";
import { categories } from "@shared/schema";
import slugify from "slugify";

async function seed() {
  console.log("Seeding database...");

  const categoryNames = [
    "Technology",
    "Writing Tips", 
    "Lifestyle",
    "Travel",
    "Business",
    "Design"
  ];

  for (const name of categoryNames) {
    const slug = slugify(name, { lower: true, strict: true });
    
    try {
      await db.insert(categories).values({ name, slug }).onConflictDoNothing();
      console.log(`✓ Added category: ${name}`);
    } catch (error) {
      console.log(`  Category ${name} already exists`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
