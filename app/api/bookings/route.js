import { db } from "@/lib/db";

/* ================= CREATE BOOKING ================= */
export async function POST(req) {
  try {
    const {
      bookingType,
      itemId,
      itemTitle,
      fullName,
      email,
      phone,
      travelDate,
      travelers,
      message,
    } = await req.json();

    if (!bookingType || !itemTitle || !fullName || !email || !phone) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO bookings 
      (booking_type, item_id, item_title, full_name, email, phone, travel_date, travelers, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingType,
        itemId || null,
        itemTitle,
        fullName,
        email,
        phone,
        travelDate || null,
        travelers || 1,
        message || null,
      ]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
