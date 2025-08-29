
type ModalProp = {
    message : string;
    onClose: () => void;
}
export default function MessageModal({
  message,
  onClose,
}: ModalProp) {
    return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="text-gray-800 mb-4 whitespace-pre-line text-center">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
}