import { db } from "@/lib/db";
import { makeSlug } from "@/lib/slug";
import fs from "fs";
import path from "path";

/* ================= GET ================= */
export async function GET(request, context) {
  const { id } = await context.params;
  const packageId = Number(id);

  if (!packageId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const [rows] = await db.query(
    "SELECT * FROM packages WHERE id = ? LIMIT 1",
    [packageId]
  );

  if (!rows.length) {
    return Response.json({ error: "Package not found" }, { status: 404 });
  }

  return Response.json(rows[0]);
}

/* ================= UPDATE ================= */
export async function PUT(request, context) {
  const { id } = await context.params;
  const packageId = Number(id);

  if (!packageId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const formData = await request.formData();

  const title = formData.get("title");
  const category_id = formData.get("category_id");
  const short_description = formData.get("short_description");
  const description = formData.get("description");
  const price = formData.get("price");
  const duration_days = formData.get("duration_days");
  const status = formData.get("status");
  const image = formData.get("image");

  const slug = makeSlug(title);

  let imageSql = "";
  const values = [
    title,
    slug,
    category_id,
    short_description,
    description,
    price,
    duration_days,
    status,
  ];

  if (image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const imageName = `${Date.now()}-${image.name}`;

    fs.writeFileSync(
      path.join(process.cwd(), "public/images/packages", imageName),
      buffer
    );

    imageSql = ", image = ?";
    values.push(imageName);
  }

  values.push(packageId);

  await db.query(
    `UPDATE packages SET
      title = ?,
      slug = ?,
      category_id = ?,
      short_description = ?,
      description = ?,
      price = ?,
      duration_days = ?,
      status = ?
      ${imageSql}
      WHERE id = ?`,
    values
  );

  return Response.json({ success: true });
}

/* ================= DELETE ================= */
export async function DELETE(request, context) {
  const { id } = await context.params;
  const packageId = Number(id);

  if (!packageId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  await db.query("DELETE FROM packages WHERE id = ?", [packageId]);

  return Response.json({ success: true });
}
