const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    level: { type: Number, default: 0 },
    ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  {
    timestamps: true,
  }
);

// Define the compound index
categorySchema.index(
  { name: 1, parent: 1 },
  { unique: true, background: true, timeout: 60000 }
);

categorySchema.statics.createCategoryPath = async function (categories) {
  let parent = null;
  let ancestors = [];
  let fullPath = [];

  for (let i = 0; i < categories.length; i++) {
    const { name, description } = categories[i];
    fullPath.push(name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    const slug = fullPath.join("-");

    let category = await this.findOne({ slug });

    if (!category) {
      category = await this.create({
        name,
        slug,
        description,
        parent: parent?._id,
        level: i,
        ancestors: [...ancestors],
      });
    }

    parent = category;
    ancestors.push(category._id);
  }

  return parent;
};

const Category = mongoose.model("Category", categorySchema);

// Modified index management - Don't drop indexes, just ensure they exist
const ensureIndexes = async () => {
  try {
    // Wait for connection to be ready
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await Category.createIndexes();
    console.log("Category indexes verified successfully");
  } catch (err) {
    console.warn("Category index warning:", err.message);
  }
};

// Run index creation in background
if (process.env.NODE_ENV !== "test") {
  setTimeout(() => {
    ensureIndexes().catch(console.warn);
  }, 10000);
}

// Call ensureIndexes when the module is imported
ensureIndexes();

module.exports = Category;
