import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import slugify from "slugify";


/* ============================
   GET SINGLE CATEGORY (EDIT)
============================ */
export async function GET(req, { params }) {
  try {
    const { id } = await params;

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

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Fetch category error:", error);
    return Response.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
// ===========
// Update 
// ===========

export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ FIX: no await

    const formData = await req.formData();

    const name = formData.get("name");
    const status = formData.get("status");
    const imageFile = formData.get("image");

    if (!name || name.trim().length < 3) {
      return Response.json(
        { error: "Category name must be at least 3 characters" },
        { status: 400 }
      );
    }

    // ✅ Always generate slug on backend
    const slug = slugify(name, { lower: true });

    let imageName = null;

    if (imageFile && typeof imageFile === "object" && imageFile.name) {
      imageName = `${Date.now()}-${imageFile.name}`;

      const uploadDir = path.join(
        process.cwd(),
        "public/images/categories"
      );

      const filePath = path.join(uploadDir, imageName);

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await writeFile(filePath, buffer);
    }

    await db.query(
      `
      UPDATE categories
      SET 
        name = ?,
        slug = ?,
        status = ?,
        image = COALESCE(?, image)
      WHERE id = ?
      `,
      [name.trim(), slug, status, imageName, id]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update category error:", error);
    return Response.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}



export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    /* OPTIONAL SAFETY CHECK
       Prevent deleting category if tours are using it */
    const [used] = await db.query(
      "SELECT id FROM tours WHERE category_id = ? LIMIT 1",
      [id]
    );

    if (used.length > 0) {
      return Response.json(
        { error: "Category is in use by tours and cannot be deleted" },
        { status: 409 }
      );
    }

    /* Delete category */
    const [result] = await db.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return Response.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
