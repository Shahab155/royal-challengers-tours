import { db } from "@/lib/db";

export async function GET(req, { params }) {
  const { slug } = await params;
  const { searchParams } =  await new URL(req.url);

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const time = searchParams.get("time");

  try {
    // 1️⃣ Get service (category)
    const [[service]] = await db.query(
      `SELECT id, name, image FROM categories WHERE slug = ? AND status = 'active'`,
      [slug]
    );

    if (!service) {
      return Response.json({ service: null, tours: [], timeSlots: [] });
    }

    // 2️⃣ Build tour query
    let tourSql = `
      SELECT t.*
      FROM tours t
      WHERE t.category_id = ?
        AND t.status = 'active'
    `;
    const values = [service.id];

    if (minPrice) {
      tourSql += " AND t.price >= ?";
      values.push(minPrice);
    }

    if (maxPrice) {
      tourSql += " AND t.price <= ?";
      values.push(maxPrice);
    }

    if (time) {
      tourSql += `
        AND EXISTS (
          SELECT 1 FROM tour_time_slots ts
          WHERE ts.tour_id = t.id
          AND ts.time_slot = ?
        )
      `;
      values.push(time);
    }

    const [tours] = await db.query(tourSql, values);

    // 3️⃣ Fetch available time slots for this service
    const [timeSlots] = await db.query(
      `
      SELECT DISTINCT ts.time_slot
      FROM tour_time_slots ts
      JOIN tours t ON t.id = ts.tour_id
      WHERE t.category_id = ?
      ORDER BY ts.time_slot ASC
      `,
      [service.id]
    );

    return Response.json({
      service,
      tours,
      timeSlots,
    });
  } catch (err) {
    console.error("Service API error:", err);
    return Response.json({ error: "Failed to load service" }, { status: 500 });
  }
}
