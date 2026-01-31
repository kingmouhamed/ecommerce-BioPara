// scripts/seed.js

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // ✅ يقرأ .env.local

import { createClient } from "@supabase/supabase-js";
import { products as localProducts } from "../products.js"; // ✅ تم ربط ملف المنتجات هنا

// ✅ تحقق سريع من env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
if (!SERVICE_ROLE) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");

// ✅ Supabase client (server-only)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

function normalizeProducts(items) {
  return items.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    category: p.category ?? null,
    price: Number(p.price) || 0,
    originalprice: p.originalPrice ?? null, // ✅ تم التعديل
    image: p.image ? (p.image.startsWith("/") ? p.image : `/${p.image}`) : null, // ✅ ضمان تنسيق مسار الصورة بشكل صحيح
    reviews: p.reviews ?? null,
    rating: p.rating ?? null,
    isnew: p.isNew ?? false, // ✅ تم التعديل
  }));
}

async function seed() {
  console.log("🌱 Seeding products from products.js ...");

  const dataToInsert = normalizeProducts(localProducts);

  // ✅ (اختياري) مسح القديم
  const del = await supabase.from("products").delete().neq("id", 0);
  if (del.error) {
    console.error("❌ Delete error:", del.error.message);
    process.exit(1);
  }

  // ✅ إدخال جديد
  const ins = await supabase.from("products").insert(dataToInsert);
  if (ins.error) {
    console.error("❌ Insert error:", ins.error.message);
    process.exit(1);
  }

  console.log(`✅ Inserted ${dataToInsert.length} products successfully!`);
}

seed();