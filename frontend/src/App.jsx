import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Destinations from "./pages/Destinations";
import TourPackages from "./pages/TourPackages";
import Gallery from "./pages/Gallery";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Enquiry from "./pages/Enquiry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Privacy, Terms, Cancellation, NotFound } from "./pages/StaticPages";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminEnquiries from "./admin/AdminEnquiries";
import AdminEnquiryDetail from "./admin/AdminEnquiryDetail";
import AdminReviews from "./admin/AdminReviews";
import SectionEditor from "./admin/SectionEditor";
import RequireAdmin from "./admin/RequireAdmin";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/taxi-services" element={<Services />} />
        <Route path="/car-rental" element={<Services />} />
        <Route path="/local-sightseeing" element={<Services />} />
        <Route path="/himachal-tours" element={<TourPackages />} />
        <Route path="/airport-transfer" element={<Services />} />
        <Route path="/corporate-travel" element={<Services />} />
        <Route path="/group-travel" element={<Services />} />
        <Route path="/custom-trip" element={<Enquiry />} />
        <Route path="/tour-packages" element={<TourPackages />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/cancellation-policy" element={<Cancellation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<Navigate to="/admin/login" replace />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="enquiries/:id" element={<AdminEnquiryDetail />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="content/:key" element={<SectionEditor />} />
      </Route>
    </Routes>
  );
}
