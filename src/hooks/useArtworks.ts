import { useState, useEffect } from 'react';
import { artworksAPI, Artwork } from '../lib/api';

export const useArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await artworksAPI.getAll();
      setArtworks(response.artworks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const refetch = () => {
    fetchArtworks();
  };

  return { artworks, loading, error, refetch };
};