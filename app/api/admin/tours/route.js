import { db } from "@/lib/db";
import { makeSlug } from "@/lib/slug";
import fs from "fs";
import path from "path";

/* ========== GET ALL TOURS ========== */
export async function GET() {
  const [rows] = await db.query(
    "SELECT * FROM tours ORDER BY id DESC"
  );

  return Response.json(rows);
}

/* ========== CREATE TOUR ========== */
export async function POST(request) {
  const formData = await request.formData();

  const title = formData.get("title");
  const short_description = formData.get("short_description");
  const description = formData.get("description");
  const price = formData.get("price");
  const duration_days = formData.get("duration_days");
  const category_id = formData.get("category_id");
  const status = formData.get("status");
  const image = formData.get("image");

  if (!title) {
    return Response.json({ error: "Title required" }, { status: 400 });
  }

  const slug = makeSlug(title);
  let imageName = null;

  if (image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer());
    imageName = `${Date.now()}-${image.name}`;

    fs.writeFileSync(
      path.join(process.cwd(), "public/images/tours", imageName),
      buffer
    );
  }

  await db.query(
    `INSERT INTO tours
     (title, slug, short_description, description, price, duration_days, category_id, image, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      short_description,
      description,
      price,
      duration_days,
      category_id,
      imageName,
      status,
    ]
  );

  return Response.json({ success: true });
}
