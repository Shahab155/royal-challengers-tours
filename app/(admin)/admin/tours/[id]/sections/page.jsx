"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaPlus, FaTrash, FaSave, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { z } from "zod";

/* ================= DEFAULT SECTIONS ================= */
const DEFAULT_SECTIONS = [
  { key: "included", title: "What's Included" },
  { key: "not_included", title: "What's Not Included" },
  { key: "know_before_go", title: "Know Before You Go" },
  { key: "age_policy", title: "Age Policy" },
];

/* ================= VALIDATION ================= */
const itemSchema = z
  .string()
  .min(3, "At least 3 characters")
  .max(280, "Maximum 280 characters")
  .trim();

const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  items: z.array(itemSchema).min(1, "At least one valid item is required"),
});

export default function AdminTourSectionsPage() {
  const { id } = useParams();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [addErrors, setAddErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState(null);

  // Fetch sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/tours/${id}/sections`);
      if (!res.ok) throw new Error();

      const data = await res.json();

      const merged = DEFAULT_SECTIONS.map((def) => {
        const existing = data.find((s) => s.section_key === def.key);
        return existing
          ? { ...existing, items: JSON.parse(existing.items || "[]") }
          : { section_key: def.key, title: def.title, items: [] };
      });

      setSections(merged);
      setErrors({});
      setAddErrors({});
      setGlobalMessage(null);
    } catch {
      setGlobalMessage({ type: "error", text: "Failed to load tour sections" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [id]);

  // Validate single section
  const validateSection = (section, sIdx) => {
    const newErrors = {};

    try {
      sectionSchema.parse({
        title: section.title,
        items: section.items.filter((i) => i?.trim()),
      });
    } catch (e) {
      if (e instanceof z.ZodError && e.errors) {
        e.errors.forEach((err) => {
          newErrors[`${sIdx}.${err.path.join(".")}`] = err.message;
        });
      }
    }

    // Individual item validation
    section.items.forEach((item, iIdx) => {
      if (!item?.trim()) return;
      try {
        itemSchema.parse(item);
      } catch (err) {
        if (err instanceof z.ZodError && err.errors && err.errors.length > 0) {
          newErrors[`${sIdx}.items.${iIdx}`] = err.errors[0].message;
        }
      }
    });

    return newErrors;
  };

  // Update item + validate
  const updateItem = (sIdx, iIdx, value) => {
    const copy = structuredClone(sections);
    copy[sIdx].items[iIdx] = value;
    setSections(copy);

    const sectionErrors = validateSection(copy[sIdx], sIdx);
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${sIdx}.`)) delete next[key];
      });
      return { ...next, ...sectionErrors };
    });

    if (iIdx === copy[sIdx].items.length - 1) {
      setAddErrors((prev) => ({ ...prev, [sIdx]: undefined }));
    }
  };

  // Add new empty item
  const addItem = (sIdx) => {
    const current = sections[sIdx].items;
    const lastItem = current[current.length - 1];

    if (current.length > 0 && (!lastItem || lastItem.trim() === "")) {
      setAddErrors((prev) => ({
        ...prev,
        [sIdx]: "Please fill in the current item first",
      }));
      return;
    }

    const copy = structuredClone(sections);
    copy[sIdx].items.push("");
    setSections(copy);
    setAddErrors((prev) => ({ ...prev, [sIdx]: undefined }));
  };

  // Remove item
  const removeItem = (sIdx, iIdx) => {
    const copy = structuredClone(sections);
    copy[sIdx].items.splice(iIdx, 1);
    setSections(copy);

    // Clean up errors
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${sIdx}.items.`)) delete next[key];
      });
      return next;
    });
  };

  // Delete section
  const deleteSection = async (sectionKey) => {
    if (!confirm(`Are you sure you want to delete this section? This action cannot be undone.`)) {
      return;
    }

    setGlobalMessage(null);

    try {
      const response = await fetch(`/api/admin/tours/${id}/sections`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_key: sectionKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete section");
      }

      // Refresh the sections after deletion
      await fetchSections();
      setGlobalMessage({ type: "success", text: "Section deleted successfully ✓" });
    } catch (error) {
      setGlobalMessage({ type: "error", text: error.message || "Failed to delete section" });
    }
  };

  // Save with proper validation
  const saveAllSections = async () => {
    setGlobalMessage(null);
    const allErrors = {};

    let hasCriticalError = false;

    sections.forEach((section, sIdx) => {
      const sectionErrors = validateSection(section, sIdx);
      if (Object.keys(sectionErrors).length > 0) {
        hasCriticalError = true;
        Object.assign(allErrors, sectionErrors);
      }
    });

    setErrors(allErrors);

    if (hasCriticalError) {
      setGlobalMessage({
        type: "error",
        text: "Please fix all errors before saving",
      });
      return;
    }

    setSaving(true);

    try {
      await Promise.all(
        sections.map((section) =>
          fetch(`/api/admin/tours/${id}/sections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              section_key: section.section_key,
              title: section.title,
              items: section.items.filter((i) => i?.trim()), // Only send non-empty items
            }),
          })
        )
      );

      await fetchSections();
      setGlobalMessage({ type: "success", text: "All sections saved successfully ✓" });
    } catch {
      setGlobalMessage({ type: "error", text: "Failed to save sections" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-gray-600 dark:text-gray-300">
          <FaSpinner className="animate-spin" />
          Loading tour sections...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header + Global Message */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Tour Information Sections
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage inclusions, exclusions, requirements and important notes
              </p>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border dark:border-gray-700">
              Tour ID: <span className="font-mono font-medium">{id}</span>
            </div>
          </div>

          {globalMessage && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                globalMessage.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {globalMessage.type === "success" ? "✓" : <FaExclamationCircle />}
              <span>{globalMessage.text}</span>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          <div className="space-y-8">
  {sections.map((section, sIdx) => (
    <div
      key={`${section.section_key}-${sIdx}`} // ✅ composite key
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden"
    >
      {/* Section Header */}
      <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {section.title}
        </h2>
        <button
          onClick={() => deleteSection(section.section_key)}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center gap-2"
        >
          <FaTrash size={14} /> Delete Section
        </button>
      </div>

      {/* Section Items */}
      <div className="p-6 space-y-5">
        {section.items.map((item, iIdx) => {
          const error = errors[`${sIdx}.items.${iIdx}`];

          return (
            <div key={`${section.section_key}-item-${iIdx}`} className="flex gap-4 group">
              <div className="flex-1">
                <input
                  value={item}
                  onChange={(e) => updateItem(sIdx, iIdx, e.target.value)}
                  placeholder="Enter point..."
                  className={`w-full px-4 py-3 rounded-lg border transition-all
                    ${error
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                    } focus:ring-2 focus:ring-indigo-300 outline-none dark:bg-gray-900`}
                />
                {error && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeItem(sIdx, iIdx)}
                className="p-2.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <FaTrash size={16} />
              </button>
            </div>
          );
        })}

        {/* Add New Item */}
        <div>
          <button
            onClick={() => addItem(sIdx)}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            <FaPlus size={14} /> Add new point
          </button>

          {addErrors[sIdx] && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 ml-8">
              {addErrors[sIdx]}
            </p>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

        </div>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-4 z-10 flex justify-end pt-8 pb-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg px-8 py-4 rounded-2xl border dark:border-gray-700">
            <button
              onClick={saveAllSections}
              disabled={saving}
              className={`
                flex items-center gap-3 cursor-pointer px-10 py-3.5 rounded-xl font-medium text-white transition-all
                ${saving
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                }
              `}
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save All Sections
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}