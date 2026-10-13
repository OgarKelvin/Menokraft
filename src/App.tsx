import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PageLoader from "@/components/PageLoader";

import Index from "./pages/Index";
import About from "./pages/About";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import HRServices from "./pages/HRServices";
import ManagementSystems from "./pages/ManagementSystems";
import Training from "./pages/Training";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import InternationalJobs from "./pages/InternationalJobs";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProjectManagement from "./pages/ProjectManagement";

// Component to dynamically load analytics, pixels, and verification meta tags on startup
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Inject Google Site Verification Meta Tag
    if (!document.querySelector('meta[name="google-site-verification"]')) {
      const meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = "5Ruudam3_UBR8pT5qCybsTZYNng8naXJiQ28KEXt_CU";
      document.head.appendChild(meta);
    }

    // 2. Inject Google Analytics (gtag.js) if it doesn't exist yet
    if (!(window as any).gtag) {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = "https://www.googletagmanager.com/gtag/js?id=G-BHP6Q77LZ5";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BHP6Q77LZ5');
      `;
      document.head.appendChild(script2);
    }

    // 3. Inject Meta Pixel if it doesn't exist yet
    if (!(window as any).fbq) {
      (function (f: Window, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Element) {
        if ((f as any).fbq) return;
        n = (f as any).fbq = function (...args: any[]) {
          n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
        };
        if (!(f as any)._fbq) (f as any)._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e) as HTMLScriptElement;
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s?.parentNode?.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

      (window as any).fbq("init", "1721118419216157");
    }

    // 4. Track Page Views on every route change for both tools
    if ((window as any).gtag) {
      (window as any).gtag("config", "G-BHP6Q77LZ5", {
        page_path: location.pathname + location.search,
      });
    }

    if ((window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, [location]);

  return null;
};

const App = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsQuoteOpen(true);
    window.addEventListener("open-quote-modal", handleOpenModal);

    return () => {
      window.removeEventListener("open-quote-modal", handleOpenModal);
    };
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsTracker />
        <PageLoader />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/hr-services" element={<HRServices />} />
          <Route path="/management-systems" element={<ManagementSystems />} />
          <Route path="/training" element={<Training />} />
          <Route path="/project-management" element={<ProjectManagement />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/international-jobs" element={<InternationalJobs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;