type OrderSentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function OrderSentModal({ isOpen, onClose }: OrderSentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Your order has been sent</h2>
        <p className="text-gray-700 mb-6">
          Your order has been sent and is being reviewed by the staff.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
