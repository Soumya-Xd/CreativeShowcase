import { useState } from "react";
import { usersAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export const useFollows = (initialState: boolean) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async (userId: string) => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const res = await usersAPI.follow(userId);
      setIsFollowing(res.following); // 🔥 REAL STATE UPDATE
    } catch (e) {
      console.error("Follow error", e);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, toggleFollow, loading };
};
