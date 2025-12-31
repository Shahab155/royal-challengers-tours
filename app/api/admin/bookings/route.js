import { db } from "@/lib/db";

/* ================= GET ALL BOOKINGS ================= */
export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM bookings ORDER BY created_at DESC`
    );

    // rows is already an array (even if empty)
    return Response.json(rows);           // ← 200 + [] when empty
    // or: return NextResponse.json(rows); // same thing
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}