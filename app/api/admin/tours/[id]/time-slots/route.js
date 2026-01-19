import { db } from "@/lib/db";
import { fr } from "zod/v4/locales";

export async function POST(req, { params }) {
  const { id } = await params; // ✅ awaited (Next.js latest)
  const { start_time, duration_minutes, capacity } = await req.json();

  // Validation
  if (!start_time || !duration_minutes) {
    return Response.json(
      { error: "Start time & duration required" },
      { status: 400 }
    );
  }

  try {
    await db.query(
      `INSERT INTO tour_time_slots
       (tour_id, time_slot, duration_minutes, capacity)
       VALUES (?, ?, ?, ?)`,
      [id, start_time, duration_minutes, capacity || null]
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}

// GET for time slots
export async function GET(_, { params }) {
  const { id } = await params; // ✅ awaited

  try {
    const [rows] = await db.query(
      `SELECT * FROM tour_time_slots
       WHERE tour_id = ?
       ORDER BY time_slot ASC`,
      [id]
    );

    return Response.json(rows);
  } catch (error) {
    return Response.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE slot
export async function DELETE(req, { params }) {
  const { id } = await params; // ✅ awaited
  const { slotId } = await req.json();

  // Validation
  if (!slotId) {
    return Response.json(
      { error: "Slot ID is required" },
      { status: 400 }
    );
  }

  try {
    await db.query(
      `DELETE FROM tour_time_slots WHERE id = ? AND tour_id = ?`,
      [slotId, id]
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
