import { db } from "@/lib/db";
import { makeSlug } from "@/lib/slug";
import fs from "fs";
import path from "path";


// GET Request for packages 
export async function GET() {
  const [rows] = await db.query(`
    SELECT p.*, c.name AS category_name
    FROM packages p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);

  // Check if no packages found
  if (!rows || rows.length === 0) {
    return Response.json(
      { error: "No packages found" },
      { status: 404 }
    );
  }

  return Response.json(rows, { status: 200 });
}

// POST Request for packages 
export async function POST(req) {
  const formData = await req.formData();

  const title = formData.get("title");
  const short_description = formData.get("short_description");
  const description = formData.get("description");
  const price = formData.get("price");
  const duration_days = formData.get("duration_days");
  const category_id = formData.get("category_id");
  const image = formData.get("image");

  if (!title || !price || !duration_days || !category_id) {
    return new Response(
      JSON.stringify({ error: "Required fields missing" }),
      { status: 400 }
    );
  }

  // ✅ Auto slug
  const slug = makeSlug(title);

  // ✅ Image upload
  let imageName = null;

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    imageName = `${Date.now()}-${image.name}`;
    const uploadPath = path.join(
      process.cwd(),
      "public/images/packages",
      imageName
    );

    fs.writeFileSync(uploadPath, buffer);
  }

  await db.query(
    `INSERT INTO packages
    (title, slug, category_id, short_description, description, price, duration_days, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      category_id,
      short_description,
      description,
      price,
      duration_days,
      imageName,
    ]
  );

  return Response.json({ success: true });
}
