// app/api/admin/bookings/[id]/route.js
// import your database client here (prisma, drizzle, etc.)

export async function PUT(request, { params }) {
  try {
    const { id } = await params; // await params (Next.js 15+ recommendation)
    const { status } = await request.json();

    const validStatuses = ["new", "contacted", "confirmed", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return Response.json(
        { error: "Invalid booking status" },
        { status: 400 }
      );
    }

    // Example with SQL (adapt to your DB library):
    // await db.query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);

    // Example with Prisma:
    // await prisma.booking.update({
    //   where: { id: Number(id) },
    //   data: { status },
    // });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return Response.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}