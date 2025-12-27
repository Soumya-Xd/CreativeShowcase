import React, { useState, useEffect } from 'react';
import { Eye, Heart, User, Search, Filter } from 'lucide-react';
import ArtworkCard from './ArtworkCard';
import ArtworkModal from './ArtworkModal';
import { useArtworks } from '../hooks/useArtworks';
import { Artwork } from '../lib/api';

const GallerySection: React.FC = () => {
  const { artworks, loading, error } = useArtworks();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (artworks) {
      const filtered = artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArtworks(filtered);
    }
  }, [artworks, searchTerm]);

  if (loading) {
    return (
      <section id="gallery" data-section="gallery" className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/90 to-purple-50/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading amazing artworks...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" data-section="gallery" className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/90 to-purple-50/90 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Failed to load gallery</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
  id="gallery"
  data-section="gallery"
  className="h-section w-screen h-screen bg-gradient-to-br from-slate-50/90 to-purple-50/90 backdrop-blur-sm relative overflow-hidden"
>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className={`pt-20 pb-8 px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Amazing Art
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore our curated collection of digital masterpieces from talented artists worldwide.
                Each piece tells a unique story waiting to be discovered.
              </p>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artworks, artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all duration-200">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {filteredArtworks.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No artworks found</h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share your creation!'}
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('scrollToSection', { detail: 'auth' }))}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Share Your Art
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredArtworks.map((artwork, index) => (
                  <div
                    key={artwork._id}
                    className={`transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <ArtworkCard
                      artwork={artwork}
                      onImageClick={setSelectedArtwork}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </section>
  );
};

export default GallerySection;