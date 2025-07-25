// SizeDropdown.tsx
import { sizes } from "../api/products";

interface SizeDropdownProps {
  selectedID: number | null;
  onChange: (id: number) => void;
}

export default function SizeDropdown({ selectedID, onChange }: SizeDropdownProps) {
  return (
    <select
      value={selectedID ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-1 py-1 border border-gray-300 rounded text-sm"
    >
      <option value="" disabled>
        Select
      </option>
      {sizes.map((size) => (
        <option key={size.sizeID} value={size.sizeID}>
          {size.size}
        </option>
      ))}
    </select>
  );
}
