// src/models/Product.ts
import mongoose, { Schema, model, models, Document } from "mongoose";
import slugify from "slugify";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: string;
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { 
      type: String, 
      required: [true, "Product name is required"],
      trim: true 
    },
    slug: { 
      type: String, 
      unique: true,
      trim: true 
    },
    description: { 
      type: String, 
      default: "" 
    },
    price: { 
      type: Number, 
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"] 
    },
    category: { 
      type: String, 
      required: [true, "Category is required"],
      trim: true 
    },
    inventory: { 
      type: Number, 
      default: 0,
      min: [0, "Inventory cannot be negative"] 
    },
  },
  { 
    timestamps: true 
  }
);

// Auto-generate slug before saving
ProductSchema.pre("save", async function (next) {
  if (!this.isModified("name") && !this.isModified("category")) {
    return next();
  }

  try {
    const baseSlug = slugify(`${this.category} ${this.name}`, {
      lower: true,
      strict: true,
      trim: true,
      replacement: '-'
    });

    let slug = baseSlug;
    let count = 1;

    // Use mongoose.model() directly with the model name
    while (await mongoose.model("Product").exists({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = slug;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Export the model
export const Product = models.Product || model<IProduct>("Product", ProductSchema);