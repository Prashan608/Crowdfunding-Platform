import { Box } from "@mui/material";
import Navbar from "../components/home/Navbar";
import HeroSection from "../components/home/HeroSection";
import StatisticsSection from "../components/home/StatisticsSection";
import FeaturedCampaigns from "../components/home/FeaturedCampaigns";
import HowItWorks from "../components/home/HowItWorks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import Footer from "../components/home/Footer";
import PublicNavbar from "../components/common/PublicNavbar";

const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <PublicNavbar />
      <HeroSection />
      <StatisticsSection />
      <FeaturedCampaigns />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <Footer />
    </Box>
  );
};

export default HomePage;
