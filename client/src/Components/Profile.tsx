import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserProvider";
import type { UserInfo } from "../Types/Credentials";
import { userApi } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { checkAuth } = useUserContext(); // <- make sure your context exposes signOut()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const translateRawData = (userRawData: any) => {
    const userData: UserInfo = {
      firstName: userRawData.firstName,
      lastName: userRawData.lastName,
      RIN: userRawData.RIN, // may be "", null, or undefined
      email: userRawData.email,
      role: userRawData.role,
    };
    setUserInfo(userData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await checkAuth();
        translateRawData(response.user);
      } catch (err: any) {
        setError("Couldn’t load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [checkAuth]);

  const handleSignOut = async () => {
  try {
    await userApi.logOut();        
    navigate("/", { replace: true });
  } catch (e) {
    console.error("Logout failed:", e);
    // optionally show a toast
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3 bg-white/70 rounded-2xl p-8 shadow">
          <svg
            className="animate-spin h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"/>
          </svg>
          <p className="text-gray-700 font-medium">Loading user…</p>
        </div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-2">My Profile</h2>
          <p className="text-red-600 mb-4">{error ?? "No user data available."}</p>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-black transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${userInfo.firstName ?? ""} ${userInfo.lastName ?? ""}`.trim() || "User";
  const initials = `${userInfo.firstName?.[0] ?? ""}${userInfo.lastName?.[0] ?? ""}`.toUpperCase() || "U";
  const displayRIN =
    (typeof userInfo.RIN === "string" && userInfo.RIN.trim().length > 0)
      ? userInfo.RIN
      : "Not provided";

  return (
    <div className="h-full flex justify-center pt-[]">
      <div className="bg-white rounded-2xl shadow p-6 md:p-8 max-w-3xl w-[50%] ">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">My Profile</h2>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
          <div>
            <div className="text-xl font-semibold">{fullName}</div>
            <div className="inline-flex items-center gap-2 mt-1">
              <span className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm md:text-base font-semibold">
                {userInfo.role ?? "Unknown Role"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="First name" value={userInfo.firstName || "—"} />
          <InfoRow label="Last name" value={userInfo.lastName || "—"} />
          <InfoRow label="Email" value={userInfo.email || "—"} isMono />
          <InfoRow label="RIN" value={displayRIN} isMono />
        </div>
            <div className="mt-8 flex justify-end">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition text-sm"
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, isMono = false }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-gray-900 ${isMono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
