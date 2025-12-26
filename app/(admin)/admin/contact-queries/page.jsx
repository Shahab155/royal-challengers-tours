"use client";

import { useEffect, useState } from "react";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((res) => res.json())
      .then(setInquiries);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Contact Inquiries</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Package</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-b">
                <td>{inq.name}</td>
                <td>{inq.email}</td>
                <td>{inq.phone || "—"}</td>
                <td>{inq.package || "—"}</td>
                <td className="max-w-xs truncate">
                  {inq.message}
                </td>
                <td>
                  {new Date(inq.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
