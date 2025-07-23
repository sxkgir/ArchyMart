// AddToCartButton.tsx
import type { MouseEventHandler } from "react";
import CartCheckout from "../assets/Cart.svg?react"

interface AddToCartButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export default function AddToCartButton({
  onClick,
  disabled = true,
}: AddToCartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        mt-5 border-2
        inline-flex items-center gap-2
        rounded-lg px-6 py-3
        font-semibold text-black
        hover:bg-gray-500 focus:outline-none
        active:bg-indigso-800 disabled:cursor-not-allowed
        disabled:bg-red-600 transition
      
      "
    >
    <CartCheckout className="h-7 w-7"/>    

      Add&nbsp;to&nbsp;Cart
    </button>
  );
}
