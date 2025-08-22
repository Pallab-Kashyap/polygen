import Hero from "../components/homePageComponents/Hero";
import AboutSection from "@/components/homePageComponents/AboutSection";
import TopSellers from "@/components/homePageComponents/TopSellerSection";
import BlogSection from "@/components/homePageComponents/BlogSection";

export default function HomePage() {

  return (
    <div>
      {/* <div className="relative flex flex-col h-screen"> */}
      <Hero />
      {/* </div> */}
      <AboutSection />
      <TopSellers />
      <BlogSection />
    </div>
  );
}
