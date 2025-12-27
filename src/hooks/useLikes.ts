import { useState } from "react";
import { artworksAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export const useLikes = (
  artworkId: string,
  initialLiked: boolean
) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(initialLiked);

  const toggleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      const res = await artworksAPI.like(artworkId);
      setIsLiked(res.liked); // ✅ instant UI update
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setIsLiking(false);
    }
  };

  return { isLiked, toggleLike, isLiking };
};
