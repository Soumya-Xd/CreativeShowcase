import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import UserMosaicGallery from "../components/UserMosaicGallery"; // Ensure this file exists at the specified path

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  artworks: any[];
}

const UserPublicPage = () => {
  const { username } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/profile/${username}`
        );
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        User not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold">
            {user.username[0].toUpperCase()}
          </div>

          <div>
            <h1 className="text-4xl font-bold">@{user.username}</h1>
            {user.bio && (
              <p className="text-white/60 mt-2 max-w-xl">{user.bio}</p>
            )}
          </div>
        </div>
      </section>

      {/* MOSAIC GALLERY */}
      <UserMosaicGallery artworks={user.artworks} />
    </main>
  );
};

export default UserPublicPage;
