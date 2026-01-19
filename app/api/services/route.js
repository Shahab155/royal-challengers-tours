import { db } from "@/lib/db";

/**
 * GET /api/services
 * Returns all active service categories for Tours
 */
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        slug,
        image
      FROM categories
      WHERE status = 'active'
        AND type IN ('tour', 'both')
      ORDER BY name ASC
    `);

    return Response.json(rows);
  } catch (error) {
    console.error("Services API error:", error);

    return Response.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
