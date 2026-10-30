import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";

import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Categories = lazy(() => import("./pages/Categories"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{ style: { fontSize: "14px" } }} />
          <MotionConfig reducedMotion="user">
            <Suspense fallback={<div className="section container-max min-h-[50vh] py-24"><Loader label="Loading page" /></div>}>
              <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin panel */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
            </Route>
              </Routes>
            </Suspense>
          </MotionConfig>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}

export default App;
