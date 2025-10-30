// src/lib/products.ts
import { connectDB } from "./db";
import { Product } from "./models/Product";

export interface ProductType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: string;
  inventory: number;
  createdAt: string;
  updatedAt: string;
}


// ✅ Get all products
export async function getProducts(): Promise<ProductType[]> {
  await connectDB();
  const products = await Product.find().lean();
  return products as unknown as ProductType[];
}


// ✅ Get single product by slug
export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  return product as ProductType | null;
}

// ✅ Add product (Admin)
export async function addProduct(data: ProductType): Promise<ProductType> {
  await connectDB();
  const newProduct = await Product.create(data);
  return newProduct.toObject() as ProductType;
}

// ✅ Update product (Admin)
export async function updateProduct(slug: string, data: Partial<ProductType>) {
  await connectDB();
  const updated = await Product.findOneAndUpdate({ slug }, data, { new: true }).lean();
  return updated as ProductType | null;
}

// ✅ Delete product (Admin)
export async function deleteProduct(slug: string) {
  await connectDB();
  return Product.findOneAndDelete({ slug });
}