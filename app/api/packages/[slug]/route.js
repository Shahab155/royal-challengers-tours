import { db } from "@/lib/db";

export async function GET(request, context) {
  const { slug } = await context.params;

  const [rows] = await db.query(
    `
    SELECT 
      p.*,
      c.name AS category_name
    FROM packages p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = ? AND p.status = 'active'
    LIMIT 1
    `,
    [slug]
  );

  if (!rows.length) {
    return Response.json({ error: "Package not found" }, { status: 404 });
  }

  return Response.json(rows[0]);
}
