import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GenderProvider } from "@/contexts/GenderContext";
import BottomNav from "@/components/BottomNav";
import GenderBackground from "@/components/GenderBackground";
import Index from "./pages/Index";
import SalonDetail from "./pages/SalonDetail";
import BookingFlow from "./pages/BookingFlow";
import Bookings from "./pages/Bookings";
import Offers from "./pages/Offers";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import AtHome from "./pages/AtHome";
import ArtistProfile from "./pages/ArtistProfile";
import AtHomeBooking from "./pages/AtHomeBooking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GenderProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative min-h-screen overflow-hidden">
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <GenderBackground />
            </div>
            <div className="relative z-0 max-w-7xl mx-auto md:px-8">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/salon/:id" element={<SalonDetail />} />
                <Route path="/booking/:id" element={<BookingFlow />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/at-home" element={<AtHome />} />
                <Route path="/artist/:id" element={<ArtistProfile />} />
                <Route path="/at-home-booking/:id" element={<AtHomeBooking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </GenderProvider>
  </QueryClientProvider>
);

export default App;
