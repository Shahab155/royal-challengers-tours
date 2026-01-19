  import { db } from "@/lib/db";

export async function GET(_, { params }) {
  const { slug } = await params;

  try {
    /* ================= GET TOUR ================= */
    const [[tour]] = await db.query(
      `SELECT id FROM tours WHERE slug = ? AND status = 'active'`,
      [slug]
    );

    if (!tour) {
      return Response.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    /* ================= GET AVAILABILITY RANGE ================= */
    const [[range]] = await db.query(
      `SELECT id, start_date, end_date
       FROM tour_availability
       WHERE tour_id = ?`,
      [tour.id]
    );

    if (!range) {
      return Response.json({
        range: null,
        slots: [],
      });
    }

    /* ================= GET TIME SLOTS ================= */
    const [slots] = await db.query(
      `SELECT 
        id,
        time_slot,
        duration_minutes,
        capacity
       FROM tour_time_slots
       WHERE tour_id = ?
       ORDER BY time_slot ASC`,
      [tour.id]
    );

    return Response.json({
      range,
      slots,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
