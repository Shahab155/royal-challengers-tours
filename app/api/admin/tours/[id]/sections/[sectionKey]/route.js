import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* ================= DELETE SECTION ================= */
export async function DELETE(_req, { params }) {
  try {
    const { id, sectionKey } = await params;

    if (!id || !sectionKey) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `DELETE FROM tour_sections
       WHERE tour_id = ? AND section_key = ?`,
      [Number(id), sectionKey]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE SECTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
