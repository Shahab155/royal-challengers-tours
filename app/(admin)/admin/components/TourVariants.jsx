"use client";

import { useEffect, useState } from "react";

export default function TourVariants({ tourId }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newVariant, setNewVariant] = useState({
    title: "",
    price: "",
    duration: "",
  });

  /* ================= FETCH ================= */
  const fetchVariants = async () => {
    const res = await fetch(`/api/admin/tours/${tourId}/variants`);
    const data = await res.json();
    setVariants(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchVariants();
  }, [tourId]);

  /* ================= CREATE ================= */
  const addVariant = async () => {
    if (!newVariant.title) return;

    setLoading(true);
    await fetch(`/api/admin/tours/${tourId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVariant),
    });

    setNewVariant({ title: "", price: "", duration: "" });
    await fetchVariants();
    setLoading(false);
  };

  /* ================= UPDATE ================= */
  const updateVariant = async (variant) => {
    await fetch(`/api/admin/tours/${tourId}/variants`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variantId: variant.id,
        title: variant.title,
        price: variant.price,
        duration: variant.duration,
        is_active: variant.is_active,
      }),
    });
  };

  /* ================= DELETE ================= */
  const deleteVariant = async (variantId) => {
    if (!confirm("Delete this variant?")) return;

    await fetch(`/api/admin/tours/${tourId}/variants`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId }),
    });

    fetchVariants();
  };

  return (
    <div className="space-y-8">
      {/* ADD NEW */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Add Variant</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Variant title"
            className="input"
            value={newVariant.title}
            onChange={(e) =>
              setNewVariant({ ...newVariant, title: e.target.value })
            }
          />

          <input
            placeholder="Price"
            className="input"
            value={newVariant.price}
            onChange={(e) =>
              setNewVariant({ ...newVariant, price: e.target.value })
            }
          />

          <input
            placeholder="Duration (e.g. 4 hours)"
            className="input"
            value={newVariant.duration}
            onChange={(e) =>
              setNewVariant({ ...newVariant, duration: e.target.value })
            }
          />
        </div>

        <button
          onClick={addVariant}
          disabled={loading}
          className="btn-primary mt-4"
        >
          Add Variant
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Existing Variants</h3>

        <div className="space-y-4">
          {variants.map((v) => (
            <div
              key={v.id}
              className="flex flex-wrap gap-4 items-center border-b pb-4"
            >
              <input
                className="input flex-1"
                value={v.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setVariants((prev) =>
                    prev.map((x) =>
                      x.id === v.id ? { ...x, title: val } : x
                    )
                  );
                }}
                onBlur={() => updateVariant(v)}
              />

              <input
                className="input w-32"
                value={v.price || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setVariants((prev) =>
                    prev.map((x) =>
                      x.id === v.id ? { ...x, price: val } : x
                    )
                  );
                }}
                onBlur={() => updateVariant(v)}
              />

              <input
                className="input w-40"
                value={v.duration || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setVariants((prev) =>
                    prev.map((x) =>
                      x.id === v.id ? { ...x, duration: val } : x
                    )
                  );
                }}
                onBlur={() => updateVariant(v)}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={v.is_active === 1}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setVariants((prev) =>
                      prev.map((x) =>
                        x.id === v.id
                          ? { ...x, is_active: checked ? 1 : 0 }
                          : x
                      )
                    );
                    updateVariant({ ...v, is_active: checked });
                  }}
                />
                Active
              </label>

              <button
                onClick={() => deleteVariant(v.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}

          {!variants.length && (
            <p className="text-text-secondary">
              No variants added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
