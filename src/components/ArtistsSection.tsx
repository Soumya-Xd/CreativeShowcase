import React, { useState, useEffect } from 'react';
import { User, Heart, Image, Users, Star, Award } from 'lucide-react';

const ArtistsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const featuredArtists = [
    {
      id: 1,
      username: 'alexart',
      name: 'Alex Rivera',
      bio: 'Digital artist specializing in surreal landscapes and abstract compositions.',
      artworkCount: 45,
      followersCount: 1200,
      totalLikes: 8500,
      featured: true,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      username: 'maya_creates',
      name: 'Maya Chen',
      bio: 'Contemporary artist exploring the intersection of technology and nature.',
      artworkCount: 32,
      followersCount: 890,
      totalLikes: 6200,
      featured: true,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      username: 'pixel_master',
      name: 'Jordan Kim',
      bio: 'Pixel art enthusiast creating retro-inspired digital masterpieces.',
      artworkCount: 67,
      followersCount: 2100,
      totalLikes: 12000,
      featured: true,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      username: 'neon_dreams',
      name: 'Sam Taylor',
      bio: 'Cyberpunk and neon aesthetic specialist with a passion for futuristic art.',
      artworkCount: 28,
      followersCount: 750,
      totalLikes: 4800,
      featured: false,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      username: 'abstract_soul',
      name: 'Riley Morgan',
      bio: 'Abstract expressionist bringing emotions to life through digital canvas.',
      artworkCount: 41,
      followersCount: 1500,
      totalLikes: 9200,
      featured: false,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 6,
      username: 'color_wizard',
      name: 'Avery Brooks',
      bio: 'Color theory expert creating vibrant and harmonious digital compositions.',
      artworkCount: 53,
      followersCount: 980,
      totalLikes: 7100,
      featured: false,
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <section id="artists" data-section="artists" className="w-screen h-screen bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-64 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-100/5 to-pink-100/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className={`pt-20 pb-8 px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet Our
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Artists
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the creative minds behind our most inspiring artworks. 
              Connect with artists who are shaping the future of digital art.
            </p>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtists.map((artist, index) => (
                <div
                  key={artist.id}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-white/50 ${
                    artist.featured ? 'ring-2 ring-purple-500/20' : ''
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Featured badge */}
                  {artist.featured && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      Featured
                    </div>
                  )}

                  {/* Artist Avatar */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      @{artist.username}
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{artist.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
                        <Image className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{artist.artworkCount}</p>
                      <p className="text-xs text-gray-600">Artworks</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full mx-auto mb-2">
                        <Users className="w-5 h-5 text-pink-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{artist.followersCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Followers</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mx-auto mb-2">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{artist.totalLikes.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Likes</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
                      Follow
                    </button>
                    <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                      <User className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Artists Button */}
            <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3 mx-auto">
                <Award className="w-6 h-6" />
                View All Artists
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;