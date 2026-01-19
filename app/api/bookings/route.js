import { db } from "@/lib/db";
import { sendBookingEmail } from "@/lib/sendBookingEmail";

/* ================= CREATE BOOKING ================= */
export async function POST(req) {
  try {
    const {
      bookingType,
      itemId,
      itemTitle,
      tourSlug,
      slotId,
      date,
      adults,
      children,
      fullName,
      email,
      phone,
      travelDate,
      travelers,
    } = await req.json();

    if (!bookingType || !itemTitle || !fullName || !email || !phone) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine the item ID based on the booking type
    let actualItemId = itemId;

    if (!actualItemId && tourSlug && bookingType === "tour") {
      // Get the tour ID from the slug if itemId is not provided
      const [tourResult] = await db.query(
        `SELECT id FROM tours WHERE slug = ?`,
        [tourSlug]
      );

      if (tourResult && tourResult.length > 0) {
        actualItemId = tourResult[0].id;
      } else {
        return Response.json(
          { error: "Tour not found" },
          { status: 404 }
        );
      }
    }

    // 1️⃣ Save to database
    // Insert into the tour_bookings table with the correct column mappings
    // Mapping the generic booking fields to the specific tour_bookings table structure
    await db.query(
      `INSERT INTO tour_bookings
      (tour_id, booking_date, time_slot_id, adults, children, total_people, customer_name, customer_phone, customer_email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        actualItemId, // This should be the tour_id
        date || travelDate, // booking_date
        slotId, // time_slot_id
        adults || 0, // adults
        children || 0, // children
        travelers || (adults || 0) + (children || 0), // total_people
        fullName, // customer_name
        phone, // customer_phone
        email, // customer_email
      ]
    );

    // 2️⃣ Send email (non-blocking safety)
    try {
      await sendBookingEmail({
        bookingType,
        itemTitle,
        fullName,
        email,
        phone,
        travelDate,
        travelers,
        date,
        adults,
        children,
      });
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError);
      // DO NOT fail booking if email fails
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
