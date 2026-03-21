"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { searchKundenByName } from "../lib/kunden";

/**
 * @param {object} props
 * @param {import("@supabase/supabase-js").SupabaseClient | null} props.supabase
 * @param {string | null} props.userId
 * @param {string} props.value
 * @param {(v: string) => void} props.onChange
 * @param {(phone: string) => void} props.onPhoneFill
 * @param {string} [props.placeholder]
 * @param {string} [props.className]
 */
export default function KundennameAutocomplete({
  supabase,
  userId,
  value,
  onChange,
  onPhoneFill,
  placeholder = "z.B. Maria Müller",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);

  const runSearch = useCallback(
    async (q) => {
      if (!supabase || !userId) {
        setItems([]);
        return;
      }
      const trimmed = `${q}`.trim();
      if (trimmed.length < 2) {
        setItems([]);
        return;
      }
      setLoading(true);
      const { data, error } = await searchKundenByName(supabase, userId, trimmed);
      setLoading(false);
      if (error) {
        setItems([]);
        return;
      }
      setItems(data);
      setOpen(data.length > 0);
    },
    [supabase, userId]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = `${value || ""}`;
    if (q.trim().length < 2) {
      debounceRef.current = setTimeout(() => {
        setItems([]);
        setOpen(false);
      }, 0);
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }
    debounceRef.current = setTimeout(() => {
      runSearch(q);
    }, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, runSearch]);

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function selectItem(row) {
    onChange(row.kundenname);
    onPhoneFill(row.telefonnummer || "");
    setOpen(false);
    setItems([]);
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Kundenname</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (`${e.target.value}`.trim().length >= 2) setOpen(true);
          }}
          onFocus={() => {
            if (items.length > 0) setOpen(true);
          }}
          autoComplete="off"
          placeholder={placeholder}
          required
          className="h-11 w-full rounded-xl border border-zinc-300 px-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      {open && (`${value || ""}`.trim().length >= 2) ? (
        <ul
          className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {loading ? (
            <li className="px-3 py-2 text-sm text-zinc-500">Suche…</li>
          ) : items.length === 0 ? (
            <li className="px-3 py-2 text-sm text-zinc-500">Keine Treffer</li>
          ) : (
            items.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-zinc-800 hover:bg-blue-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectItem(row)}
                >
                  <span className="font-medium">{row.kundenname}</span>
                  <span className="block text-xs text-zinc-500">{row.telefonnummer}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
