import HorizontalScroll from "../components/HorizontalScroll";
import HeroSection from "../components/HeroSection";
import GallerySection from "../components/MasonryGallery";
import AboutSection from "../components/AboutSection";
import RulesSection from "../components/RulesSection";
import ContactSection from "../components/ContactSection";

const Home = () => {
  return (
    <HorizontalScroll>
      <HeroSection />
      <GallerySection />
      <AboutSection />
      <RulesSection />
      <ContactSection />
    </HorizontalScroll>
  );
};

export default Home;
