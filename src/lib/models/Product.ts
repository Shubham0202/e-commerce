import mongoose, { Schema, model, models } from "mongoose";
import slugify from "slugify";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    category: { type: String, required: true },
    inventory: Number,
  },
  { timestamps: true }
);

// Auto-generate slug before saving
ProductSchema.pre("save", async function (next) {
  if (!this.isModified("name") && !this.isModified("category")) return next();

  const baseSlug =
    slugify(`${this.category}/${this.name}`, {
      lower: true,
      strict: true,
      trim: true,
    }) || "";

  let slug = baseSlug;
  let count = 1;

  const Product = models.Product || model("Product", ProductSchema);

  // Check for duplicates
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

export const Product = models.Product || model("Product", ProductSchema);
