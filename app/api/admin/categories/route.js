// app/api/admin/categories/route.js

import { db } from "@/lib/db";
import slugify from "slugify";
import fs from "fs";
import path from "path";

/* =========================
   GET ALL CATEGORIES
========================= */
export async function GET() {
  const [rows] = await db.query("SELECT * FROM categories ORDER BY created_at DESC");
  return Response.json(rows);
}

/* =========================
   CREATE CATEGORY (WITH IMAGE)
========================= */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const type = formData.get("type") || "both";
    const status = formData.get("status") || "active";
    const image = formData.get("image");

    if (!name || name.trim().length < 3) {
      return Response.json(
        { error: "Category name must be at least 3 characters" },
        { status: 400 }
      );
    }

    const slug = slugify(name, { lower: true, strict: true });

    let imageFilename = null;

    /* ---------- IMAGE UPLOAD ---------- */
    if (image && typeof image === "object") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/images/categories");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = path.extname(image.name);
      imageFilename = `${slug}-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, imageFilename);

      fs.writeFileSync(filePath, buffer);
    }

    /* ---------- INSERT INTO DB ---------- */
    await db.query(
      `
      INSERT INTO categories (name, slug, type, status, image)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name.trim(), slug, type, status, imageFilename]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Create category error:", error);

    return Response.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
