import ArtworkCard from "./ArtworkCard";

interface Props {
  artworks: any[];
}

const UserMosaicGallery: React.FC<Props> = ({ artworks }) => {
  if (!artworks.length) {
    return (
      <div className="text-center text-white/60 py-40">
        No artworks uploaded yet
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-32">
      <div
        className="
          columns-1
          sm:columns-2
          md:columns-3
          lg:columns-4
          gap-6
        "
      >
        {artworks.map((art) => (
          <div key={art._id} className="mb-6 break-inside-avoid">
            <ArtworkCard artwork={art} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserMosaicGallery;
