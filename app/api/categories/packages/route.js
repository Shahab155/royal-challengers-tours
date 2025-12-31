import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query(`
    SELECT id, name, slug
    FROM categories
    WHERE status = 'active' AND type = 'package'
    ORDER BY name ASC
  `);

  return Response.json(rows);
}
