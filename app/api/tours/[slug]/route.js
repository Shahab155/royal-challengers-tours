import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request,
  { params }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.query(
      `
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
        c.name AS category_name,
        c.slug AS category_slug
      FROM tours t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.slug = ?
        AND t.status = 'active'
      LIMIT 1
      `,
      [slug]
    );

    if (!rows?.length) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("[API /tours/[slug]]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}