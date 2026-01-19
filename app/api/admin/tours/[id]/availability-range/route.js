import { db } from "@/lib/db";

export async function POST(req, { params }) {
  const { id } = await params; // ✅ MUST await
  const { start_date, end_date } = await req.json();

  // Validation
  if (!start_date || !end_date) {
    return Response.json(
      { error: "Start date and end date are required" },
      { status: 400 }
    );
  }

  try {
    await db.query(
      `INSERT INTO tour_availability (tour_id, start_date, end_date)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE start_date = ?, end_date = ?`,
      [id, start_date, end_date, start_date, end_date]
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}

// GET for range availability
export async function GET(_, { params }) {
  const { id } = await params; // ✅ MUST await

  try {
    const [rows] = await db.query(
      `SELECT * FROM tour_availability WHERE tour_id = ?`,
      [id]
    );

    return Response.json(rows[0] || null);
  } catch (error) {
    return Response.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}

// Delete range availability
export async function DELETE(_, { params }) {
  const { id } = await params;

  try {
    const [result] = await db.query(
      `UPDATE tour_availability 
       SET start_date = NULL, end_date = NULL 
       WHERE tour_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { message: "No availability record found" },
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json(
      { error: "Failed to clear availability range" },
      { status: 500 }
    );
  }
}
