import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import type { Status } from "../Types/Order";
import Filter from "../assets/Filter.svg?react";
import Search from "../assets/Search.svg?react";


type Props = {
  defaultSearchValue?: string;
  onSubmit: (value: string) => void;
  onStatusChange?: (statuses: Status[]) => void; // ⟵ notify parent when filters change
  selectedStatuses?: Status[];                    // ⟵ controlled selection from parent (optional)
  role: string;

};

export default function SearchAndFilter({
  defaultSearchValue = "",
  onSubmit,
  onStatusChange,
  selectedStatuses = [],
  role,
}: Props) {
    const [value, setValue] = useState(defaultSearchValue);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") onSubmit(value.trim());
    };

    // Close dropdown on outside click
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
        if (!open) return;
        const target = e.target as Node;
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
            setOpen(false);
        }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const toggleStatus = (s: Status) => {
        let next: Status[];
        
        if (selectedStatuses.includes(s)) {
            // remove it
            next = selectedStatuses.filter(x => x !== s);
        } else {
            // add it
            next = [...selectedStatuses, s];
        }

        onStatusChange?.(next);
    };

    return (
        <div className="flex gap-4 relative basis-[60%]">
        {/* Filter button */}
        <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="px-[2%] py-1.5 bg-[#005DE9] text-white rounded-[9px] font-[Inter] text-[14px] flex items-center gap-2 hover:cursor-pointer"
        >
            <Filter className="w-4 h-4" />
            Filter
        </button>

        {/* Search input */}
        <div className="relative w-[100%]">
            <input
            className="border rounded-[9px] h-full w-full pl-[1.5%] text-[0.62rem] md:text-[0.9rem]"
            placeholder={role ==="staff" ? "Search by Order ID (ORD-...), Student Name, Student Email, FormID" 
                                         : "Search by Order ID Only (ORD-...), FormID"}
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            />
            <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Dropdown */}
        {open && (
            <div
            ref={dropdownRef}
            className="absolute top-10 left-0 z-20 min-w-[220px] rounded-xl border bg-white shadow-lg p-3"
            >
            <p className="text-sm font-semibold mb-2">Status</p>
            <div className="flex flex-col gap-2 text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="accent-[#005DE9]"
                    checked={selectedStatuses.includes("pending")}
                    onChange={() => toggleStatus("pending")}
                />
                <span>Pending</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="accent-[#005DE9]"
                    checked={selectedStatuses.includes("confirmed")}
                    onChange={() => toggleStatus("confirmed")}
                />
                <span>Confirmed</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="accent-[#005DE9]"
                    checked={selectedStatuses.includes("student-accepted")}
                    onChange={() => toggleStatus("student-accepted")}
                />
                <span>Student Accepted</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="accent-[#005DE9]"
                    checked={selectedStatuses.includes("canceled")}
                    onChange={() => toggleStatus("canceled")}
                />
                <span>Canceled</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="accent-[#005DE9]"
                    checked={selectedStatuses.includes("awaiting-student")}
                    onChange={() => toggleStatus("awaiting-student")}
                />
                <span>Awaiting Student</span>
                </label>

                
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="accent-[#005DE9]"
                    checked={selectedStatuses.includes("denied")}
                    onChange={() => toggleStatus("denied")}
                    
                />
                <span>Denied</span>
                </label>
            </div>

            {/* Optional footer actions */}
            <div className="mt-3 flex gap-2 justify-end">
                <button
                type="button"
                className="text-xs px-2 py-1 rounded border"
                onClick={() => onStatusChange?.([])}
                >
                Clear
                </button>
                <button
                type="button"
                className="text-xs px-2 py-1 rounded bg-[#005DE9] text-white"
                onClick={() => setOpen(false)}
                >
                Done
                </button>
            </div>
            </div>
        )}
        </div>
    );
    }
