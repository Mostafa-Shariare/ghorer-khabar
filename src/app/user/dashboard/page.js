"use client";

import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState(null);
  const [voteStatus, setVoteStatus] = useState("");
  const [voteLoading, setVoteLoading] = useState(false);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    fetchDashboard();
    fetchActivePoll();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    const res = await fetch("/api/user/dashboard");
    const data = await res.json();
    setDashboard(data);
    setLoading(false);
  }

  async function fetchActivePoll() {
    const res = await fetch("/api/polls/active");
    const data = await res.json();
    if (data.success && data.poll) {
      setPoll(data.poll);
      // Check if user has already voted
      const myVote = data.poll.responses?.find(r => r.userId === data.userId);
      setUserVote(myVote?.response || null);
    }
  }

  async function handleVote(response) {
    if (!poll) return;
    setVoteLoading(true);
    setVoteStatus("");
    try {
      const res = await fetch(`/api/user/polls/${poll._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Vote recorded!");
        setVoteStatus("Vote recorded!");
        setUserVote(response);
        fetchActivePoll();
      } else {
        toast.error(data.message || "Error voting");
        setVoteStatus(data.message || "Error voting");
      }
    } finally {
      setVoteLoading(false);
    }
  }

  if (loading || !dashboard) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">User Dashboard</h1>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Meal Package</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-600">Package</div>
              <div className="font-medium text-lg">{dashboard.mealPackage || "-"}</div>
            </div>
            <div>
              <div className="text-gray-600">Price</div>
              <div className="font-medium text-lg">${dashboard.price?.toFixed(2) || "-"}</div>
            </div>
            <div>
              <div className="text-gray-600">Amount Paid</div>
              <div className="font-medium text-lg">${dashboard.amountPaid?.toFixed(2) || "-"}</div>
            </div>
            <div>
              <div className="text-gray-600">Due</div>
              <div className="font-medium text-lg text-red-600">${dashboard.due?.toFixed(2) || "-"}</div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Total "Yes" Meals</h2>
          <div className="text-3xl font-bold text-blue-700">{dashboard.yesVotes}</div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Current Active Poll</h2>
          {poll ? (
            <div className="border rounded-lg p-4 mb-2 bg-gray-50">
              <div className="font-medium text-gray-900 mb-1 text-lg">{poll.title}</div>
              <div className="text-gray-600 text-sm mb-2">Expires: {new Date(poll.expiresAt).toLocaleString()}</div>
              <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                {userVote ? (
                  <div className="mb-2 sm:mb-0">You voted: <span className="font-semibold">{userVote}</span></div>
                ) : (
                  <div className="mb-2 sm:mb-0 text-gray-500">You have not voted yet.</div>
                )}
                <div className="flex gap-2">
                  <button
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors ${userVote === "yes" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-blue-100"}`}
                    disabled={voteLoading}
                    onClick={() => handleVote("yes")}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors ${userVote === "no" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-blue-100"}`}
                    disabled={voteLoading}
                    onClick={() => handleVote("no")}
                  >
                    No
                  </button>
                </div>
                {voteStatus && <div className="mt-2 text-green-600">{voteStatus}</div>}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No active poll at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
} 