import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.title,
      p.slug,
      p.short_description,
      p.price,
      p.duration_days,
      p.image,
      c.slug AS category_slug
    FROM packages p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'active'
    ORDER BY p.created_at DESC
  `);

  return Response.json(rows);
}
