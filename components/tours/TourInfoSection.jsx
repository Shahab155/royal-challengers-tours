"use client";

import { useState, useEffect, useCallback } from "react";
import { FaChevronDown, FaCheckCircle } from "react-icons/fa";

export default function TourInfoSection({ tourId, tourDescription }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = useCallback(async () => {
    if (!tourId) {
      console.warn("[TourInfoSection] Missing tourId → skipping fetch");
      setLoading(false);
      setError("Tour ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000";

    const url = `${baseUrl}/api/admin/tours/${tourId}/sections`;

    console.log("[TourInfoSection] Fetching:", url);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
        next: { revalidate: 0 },
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Failed to fetch sections (${response.status}) - ${errorText}`
        );
      }

      const fetchedSections = await response.json();

      const overviewSection = {
        section_key: "overview",
        title: "Tour Overview",
        items: tourDescription || "",
      };

      setSections([overviewSection, ...(Array.isArray(fetchedSections) ? fetchedSections : [])]);
    } catch (err) {
      console.error("[TourInfoSection] Fetch error:", err);

      if (err.name === "AbortError") {
        setError("Request timed out. The server is taking too long to respond.");
      } else {
        setError(err.message || "Failed to load tour information");
      }

      if (tourDescription) {
        setSections([
          {
            section_key: "overview",
            title: "Tour Overview",
            items: tourDescription,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [tourId, tourDescription]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // ──────────────────────────────────────────────
  // Loading State
  // ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center min-h-[300px] gap-5">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500/30 border-t-primary-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaCheckCircle className="text-accent-500/40 animate-pulse" size={24} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-[var(--color-text)]">
            Loading tour details...
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] opacity-80">
            Please wait a moment — fetching your tour information
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Error State
  // ──────────────────────────────────────────────
  if (error) {
    return (
      <div className="glass-card p-8 text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Couldn't load tour details
          </h3>
          <p className="text-[var(--color-text-secondary)] mb-4">{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchSections();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="glass-card p-10 text-center text-[var(--color-text-secondary)]">
        No tour information available at the moment.
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Main Content
  // ──────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const points = normalizeItems(section.items);
        const isOverview = section.section_key === "overview";
        const hasContent = points.length > 0;

        return (
          <div
            key={section.section_key || `section-${index}`}
            className={`
              glass-card overflow-hidden transition-all duration-300
              ${isOverview ? "ring-1 ring-accent-500/20 shadow-lg shadow-accent-500/5" : ""}
            `}
          >
            <details className="group">
              <summary
                className={`
                  flex items-center justify-between w-full px-6 py-5
                  cursor-pointer select-none transition-all duration-300
                  hover:bg-white/5 dark:hover:bg-black/10
                  group-open:bg-gradient-to-r group-open:from-white/8 group-open:to-transparent
                  dark:group-open:from-black/12 dark:group-open:to-transparent
                `}
              >
                <div className="flex items-center gap-3.5">
                  {isOverview && (
                    <div className="flex-shrink-0">
                      <FaCheckCircle
                        className="text-white bg-primary-500 p-1.5 rounded-full shadow-sm"
                        size={26}
                      />
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                    {section.title}
                  </h3>
                </div>

                <span
                  className={`
                    text-[var(--color-text-secondary)] transition-all duration-400
                    group-open:rotate-180 group-open:scale-110 group-open:text-accent-500
                  `}
                >
                  <FaChevronDown size={20} />
                </span>
              </summary>

              <div className="px-6 pb-9 pt-2">
                {!hasContent ? (
                  <p className="py-8 text-center italic text-[var(--color-text-secondary)]/75">
                    No detailed information available for this section
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {points.map((point, idx) => (
                      <li
                        key={idx}
                        className={`
                          flex items-start gap-4 text-[var(--color-text-secondary)]
                          transition-colors duration-200 hover:text-[var(--color-text)]
                        `}
                      >
                        <div className="mt-1 flex-shrink-0">
                          <FaCheckCircle
                            className="
                              text-white bg-primary-500 
                              p-1.5 rounded-full 
                              shadow-sm 
                              transition-all duration-300
                              group-hover:scale-110 group-hover:shadow-md
                            "
                            size={22}
                          />
                        </div>
                        <span className="leading-relaxed text-base">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          </div>
        );
      })}
    </div>
  );
}

function normalizeItems(items) {
  if (!items) return [];

  if (typeof items === "string") {
    const trimmed = items.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(String).map(s => s.trim()).filter(Boolean);
        }
      } catch {}
    }
    return trimmed.split("\n").map(s => s.trim()).filter(Boolean);
  }

  if (Array.isArray(items)) {
    return items.map(String).map(s => s.trim()).filter(Boolean);
  }

  return [];
}