import { db } from "@/lib/db";

/* ================= CREATE INQUIRY ================= */
export async function POST(request) {
  const body = await request.json();

  const { name, email, phone, package: pkg, message } = body;

  if (!name || !email || !message) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.query(
    `INSERT INTO contact_queries 
     (name, email, phone, package, message)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone || null, pkg || null, message]
  );

  return Response.json({ success: true });
}

/* ================= FETCH ALL (ADMIN) ================= */
export async function GET() {
  const [rows] = await db.query(
    "SELECT * FROM contact_queries ORDER BY createdAt DESC"
  );

  return Response.json(rows);
}
