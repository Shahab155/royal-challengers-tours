import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        t.title,
        t.slug,
        t.short_description,
        t.description,
        t.price,
        t.duration_days,
        t.image,
        t.status,
        c.slug AS category_slug
      FROM tours t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.status = 'active'
      ORDER BY t.created_at DESC
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/tours error:", error);

    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
