import CategoryFilter from "../CategoryFilter";

export default function CategoryFilterExample() {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
      <CategoryFilter
        categories={["Technology", "Writing Tips", "Lifestyle", "Travel", "Business", "Design"]}
        onCategoryChange={(cat) => console.log("Selected:", cat)}
      />
    </div>
  );
}
