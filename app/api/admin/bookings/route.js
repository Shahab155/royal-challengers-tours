import { db } from "@/lib/db";

/* ================= GET ALL BOOKINGS (ADMIN) ================= */
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT
        b.id,
        b.booking_date,
        b.adults,
        b.children,
        b.total_people,
        b.status,
        b.created_at,
        b.payment_method,

        -- customer
        b.customer_name,
        b.customer_phone,
        b.customer_email,

        -- tour
        t.title AS tour_title,

        -- time slot
        CONCAT(
          DATE_FORMAT(s.time_slot, '%h:%i %p'),
          ' (',
          s.duration_minutes,
          ' mins)'
        ) AS time_slot

      FROM tour_bookings b
      INNER JOIN tours t ON t.id = b.tour_id
      LEFT JOIN tour_time_slots s ON s.id = b.time_slot_id
      ORDER BY b.created_at DESC
    `);

    return Response.json(rows);
  } catch (error) {
    console.error("ADMIN BOOKINGS ERROR:", error);
    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
