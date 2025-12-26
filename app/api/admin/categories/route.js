import { db } from "@/lib/db";
import slugify from "slugify";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM categories");
  return Response.json(rows);
}

export async function POST(req) {
  const { name, type, status } = await req.json();

  const slug = slugify(name, { lower: true });

  await db.query(
    "INSERT INTO categories (name, slug, type, status) VALUES (?, ?, ?, ?)",
    [name, slug, type, status]
  );

  return Response.json({ success: true });
}
