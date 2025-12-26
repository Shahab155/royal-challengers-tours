import { db } from "@/lib/db";
import slugify from "slugify";

/* ================= GET CATEGORY ================= */
export async function GET(request, context) {
  const params = await context.params; // ✅ IMPORTANT
  const id = Number(params.id);

  if (!id) {
    return Response.json(
      { error: "Invalid category ID" },
      { status: 400 }
    );
  }

  const [rows] = await db.query(
    "SELECT * FROM categories WHERE id = ? LIMIT 1",
    [id]
  );

  if (!rows.length) {
    return Response.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  // ✅ Ensure JSON-safe response
  return Response.json(JSON.parse(JSON.stringify(rows[0])));
}

/* ================= UPDATE CATEGORY ================= */
export async function PUT(request, context) {
  const params = await context.params; // ✅ IMPORTANT
  const id = Number(params.id);

  if (!id) {
    return Response.json(
      { error: "Invalid category ID" },
      { status: 400 }
    );
  }

  const { name, type, status } = await request.json();

  if (!name) {
    return Response.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const slug = slugify(name, { lower: true, strict: true });

  await db.query(
    "UPDATE categories SET name=?, slug=?, type=?, status=? WHERE id=?",
    [name, slug, type, status, id]
  );

  return Response.json({ success: true });
}

/* ================= DELETE CATEGORY ================= */
export async function DELETE(request, context) {
  const params = await context.params;
  const id = Number(params.id);

  if (!id) {
    return Response.json(
      { error: "Invalid category ID" },
      { status: 400 }
    );
  }

  await db.query("DELETE FROM categories WHERE id = ?", [id]);

  return Response.json({ success: true });
}
