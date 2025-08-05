import { useState,useEffect } from "react";
import { useUserContext } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";
export default function StudentLoginPage() {
  const { LoginStudent,errorMessage, isLoggedIn, setErrorMessage,checkAuth,isPolling} = useUserContext();
  const [RIN, setRIN] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


    const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      setModalMessage(errorMessage);
      setShowModal(true);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 2000);

    return () => clearInterval(interval);
  }, [isPolling]);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setShowModal(false);
    setModalMessage("");
    
    const user = {
      email : email,
      RIN : Number(RIN),
    }
    if (!RIN || !email) {
      setModalMessage("Please enter both RIN and email.");
      return setShowModal(true);
    }
    if (!/^\d{9}$/.test(RIN)) {
      setModalMessage("RIN must be exactly 9 digits.");
      return setShowModal(true);
    }    
    try{
      setIsSubmitting(true);
      await LoginStudent(user);
  }finally{
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#202225] flex items-center justify-center p-4">
        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#202225]/60 z-20">
            <svg
              className="animate-spin h-12 w-12 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                d="M22 12a10 10 0 01-10 10"
              />
            </svg>
          </div>
        )}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white rounded-lg p-8 shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6">Student Login</h2>
        <input
          type="number"
          value={RIN}
          placeholder="Enter your RIN"
          onChange={(e) => setRIN(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          value={email}
          placeholder="Enter your RPI Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className={`w-full py-2 rounded ${
            isPolling ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isPolling}
        >
          {isPolling ? "Waiting for verification..." : "Log In"}
        </button>
      </form>
    </div>
      {showModal && (
        <Modal message={modalMessage} onClose={() => {setShowModal(false);}} />
      )}
    </>

  );
}

function Modal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-[#202225] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="text-gray-800 mb-4">{message}</p>
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