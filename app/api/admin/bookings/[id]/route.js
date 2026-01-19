import { db } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const allowedStatuses = [
      "new",
      "contacted",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return Response.json(
        { error: "Invalid booking status" },
        { status: 400 }
      );
    }

    // ✅ UPDATE booking status (MariaDB compatible)
    const [result] = await db.query(
      `
      UPDATE tour_bookings
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // ✅ OPTIONAL: Fetch updated booking (clean & safe)
    const [rows] = await db.query(
      `
      SELECT id, status
      FROM tour_bookings
      WHERE id = ?
      `,
      [id]
    );

    return Response.json({
      success: true,
      booking: rows[0],
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return Response.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
