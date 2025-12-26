import { db } from "@/lib/db";
import { makeSlug } from "@/lib/slug";
import fs from "fs";
import path from "path";

/* ========== GET ONE ========== */
export async function GET(request, context) {
  const { id } = await context.params;
  const tourId = Number(id);

  if (!tourId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const [rows] = await db.query(
    "SELECT * FROM tours WHERE id = ? LIMIT 1",
    [tourId]
  );

  if (!rows.length) {
    return Response.json({ error: "Tour not found" }, { status: 404 });
  }

  return Response.json(rows[0]);
}

/* ========== UPDATE ========== */
export async function PUT(request, context) {
  const { id } = await context.params;
  const tourId = Number(id);

  const formData = await request.formData();

  const title = formData.get("title");
  const short_description = formData.get("short_description");
  const description = formData.get("description");
  const price = formData.get("price");
  const duration_days = formData.get("duration_days");
  const category_id = formData.get("category_id");
  const status = formData.get("status");
  const image = formData.get("image");

  const slug = makeSlug(title);

  let imageSql = "";
  const values = [
    title,
    slug,
    short_description,
    description,
    price,
    duration_days,
    category_id,
    status,
  ];

  if (image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const imageName = `${Date.now()}-${image.name}`;

    fs.writeFileSync(
      path.join(process.cwd(), "public/images/tours", imageName),
      buffer
    );

    imageSql = ", image = ?";
    values.push(imageName);
  }

  values.push(tourId);

  await db.query(
    `UPDATE tours SET
      title = ?,
      slug = ?,
      short_description = ?,
      description = ?,
      price = ?,
      duration_days = ?,
      category_id = ?,
      status = ?
      ${imageSql}
      WHERE id = ?`,
    values
  );

  return Response.json({ success: true });
}

/* ========== DELETE ========== */
export async function DELETE(request, context) {
  const { id } = await context.params;
  const tourId = Number(id);

  await db.query("DELETE FROM tours WHERE id = ?", [tourId]);

  return Response.json({ success: true });
}
