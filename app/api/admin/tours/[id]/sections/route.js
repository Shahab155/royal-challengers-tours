import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* GET all sections for a tour */
export async function GET(_, { params }) {
  const { id } = await params; // ✅ awaited

  try {
    const [rows] = await db.query(
      `SELECT * FROM tour_sections
       WHERE tour_id = ?
       ORDER BY sort_order ASC`,
      [id]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET tour sections failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

/* POST new section or update existing */
export async function POST(req, { params }) {
  const { id } = await params;
  const { section_key, title, items } = await req.json();

  // Basic validation
  if (!section_key || !title || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Invalid data. Section must have key, title, and items array" },
      { status: 400 }
    );
  }

  try {
    // Prevent duplicate section_key for the same tour
    const [existing] = await db.query(
      `SELECT id FROM tour_sections WHERE tour_id = ? AND section_key = ?`,
      [id, section_key]
    );

    if (existing.length > 0) {
      // Update existing section
      await db.query(
        `UPDATE tour_sections SET title = ?, items = ? WHERE tour_id = ? AND section_key = ?`,
        [title, JSON.stringify(items), id, section_key]
      );
    } else {
      // Insert new section
      await db.query(
        `INSERT INTO tour_sections (tour_id, section_key, title, items)
         VALUES (?, ?, ?, ?)`,
        [id, section_key, title, JSON.stringify(items)]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST tour section failed:", err);
    return NextResponse.json(
      { error: "Failed to save section" },
      { status: 500 }
    );
  }
}

/* DELETE a section */
export async function DELETE(req, { params }) {
  const { id } = await params;
  const { section_key } = await req.json();

  if (!section_key) {
    return NextResponse.json(
      { error: "Section key is required" },
      { status: 400 }
    );
  }

  try {
    // Delete the section
    const [result] = await db.query(
      `DELETE FROM tour_sections WHERE tour_id = ? AND section_key = ?`,
      [id, section_key]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE tour section failed:", err);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
