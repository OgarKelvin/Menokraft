import React, { useState, useEffect } from "react";
import { 
  Briefcase, FileText, Loader2, CheckCircle2, AlertCircle, 
  Search, LogOut, Users, Globe, ChevronRight, FileDown, 
  Trash2, Calendar, Eye, X, Mail, Phone, User, Shield
} from "lucide-react";

interface JobApplication {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  resume_url: string;
  cover_letter: string;
  created_at: string;
  job_title: string;
  job_category: string;
}

const Admin = () => {
  // Authentication & Role Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "staff" | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");

  // Global UI States
  const [loading, setLoading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState({ type: "", text: "" });

  // Received Applications States
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Modal State for Viewing Detailed Application
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Date Sorting & Filtering States
  const [dateSortOrder, setDateSortOrder] = useState<"newest" | "oldest">("newest");
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "today" | "7days" | "30days">("all");

  // Input Forms States
  const [jobForm, setJobForm] = useState({
    title: "", company: "", location: "", job_type: "full time",
    category: "", salary_range: "", description: "", requirements: ""
  });

  const [blogForm, setBlogForm] = useState({
    title: "", content: "", category: "", author: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch Received Applications when tab shifts
  useEffect(() => {
    if (isAuthenticated && (activeTab === "applications" || activeTab === "international")) {
      fetchApplications();
    }
  }, [isAuthenticated, activeTab]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedApp(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper to construct clean resume URLs without double slashes or duplicated folders
  const getResumeUrl = (path: string) => {
    if (!path) return "#";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    
    // Remove all leading slashes, backslashes, and any leading 'uploads/' variations
    const cleanPath = path.replace(/^[/\\]+/, "").replace(/^(uploads|Uploads)[/\\]+/, "");
    
    return `/uploads/${cleanPath}`;
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "international" 
        ? "/api/applications/international" 
        : "/api/applications/local";

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        console.error("Server responded with an error status:", res.status);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "Admin56@#$%") {
      setIsAuthenticated(true);
      setUserRole("admin");
      setLoginError("");
    } else if (username === "staff" && password === "Menokstaff12@&") {
      setIsAuthenticated(true);
      setUserRole("staff");
      setActiveTab("jobs");
      setLoginError("");
    } else {
      setLoginError("Invalid Username or Password");
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGlobalMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post job");

      setGlobalMessage({ type: "success", text: "Job listing successfully compiled to live board!" });
      setJobForm({
        title: "", company: "", location: "", job_type: "full time",
        category: "", salary_range: "", description: "", requirements: ""
      });
    } catch (err: any) {
      setGlobalMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "admin") return;

    setLoading(true);
    setGlobalMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("title", blogForm.title);
      formData.append("content", blogForm.content);
      formData.append("category", blogForm.category);
      formData.append("author", blogForm.author);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server route not found or failed (${res.status} ${res.statusText}).`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post article");

      setGlobalMessage({ type: "success", text: "Blog piece published and live!" });
      setBlogForm({ title: "", content: "", category: "", author: "" });
      setImageFile(null);
    } catch (err: any) {
      setGlobalMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (id: number) => {
    if (userRole !== "admin") {
      alert("Permission denied: Only administrators can delete records.");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently delete this application?")) {
      return;
    }

    setLoading(true);
    setGlobalMessage({ type: "", text: "" });

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setGlobalMessage({ type: "success", text: "Application record deleted successfully!" });
        if (selectedApp?.id === id) setSelectedApp(null);
        fetchApplications();
      } else {
        const data = await res.json();
        setGlobalMessage({ type: "error", text: data.error || "Failed to delete application" });
      }
    } catch (err) {
      console.error("Error deleting application:", err);
      setGlobalMessage({ type: "error", text: "A connection error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications
    .filter(app => {
      const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.job_title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const appCategory = app.job_category || "General";
      const matchesCategory = categoryFilter === "All" || appCategory === categoryFilter;

      let matchesDateRange = true;
      if (app.created_at) {
        const appDate = new Date(app.created_at).getTime();
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (dateRangeFilter === "today") {
          matchesDateRange = now - appDate <= oneDay;
        } else if (dateRangeFilter === "7days") {
          matchesDateRange = now - appDate <= 7 * oneDay;
        } else if (dateRangeFilter === "30days") {
          matchesDateRange = now - appDate <= 30 * oneDay;
        }
      }

      return matchesSearch && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      return dateSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const uniquelyFoundCategories = ["All", ...Array.from(new Set(applications.map(a => a.job_category).filter(Boolean)))];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0e12] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300">
          <div className="h-3 bg-blue-600 w-full" />
          <div className="p-8 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">MENOKRAFT PORTAL</h1>
            <p className="text-sm text-slate-500 font-medium mb-6">SECURE GATEWAY ACCESS</p>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-center gap-2 font-semibold">
                <AlertCircle size={14} /> {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Username</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full px-4 py-3 border rounded-xl bg-slate-50 outline-none font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password..."
                  className="w-full px-4 py-3 border rounded-xl bg-slate-50 outline-none font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all text-sm tracking-wide shadow-md shadow-blue-600/20 mt-2">
                LOG IN
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex text-slate-800 antialiased font-sans">
      <aside className="w-64 bg-[#0d0e12] flex flex-col shrink-0 text-slate-400 border-r border-slate-800">
        <div className="p-6">
          <img src="/logo-.png" alt="Menokraft Logo" className="w-32 mx-auto" />
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <button 
            onClick={() => setActiveTab("jobs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === "jobs" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "hover:bg-slate-900 hover:text-white"}`}
          >
            <Briefcase size={18} /> Job Postings
          </button>
          
          <button 
            onClick={() => setActiveTab("applications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === "applications" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "hover:bg-slate-900 hover:text-white"}`}
          >
            <Users size={18} /> Received Applications
          </button>

          <button 
            onClick={() => setActiveTab("international")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === "international" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "hover:bg-slate-900 hover:text-white"}`}
          >
            <Globe size={18} /> International Jobs
          </button>

          {userRole === "admin" && (
            <button 
              onClick={() => setActiveTab("blogs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === "blogs" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "hover:bg-slate-900 hover:text-white"}`}
            >
              <FileText size={18} /> Blog Posting
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              setUserRole(null);
            }} 
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-950 hover:text-red-400 font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider transition-all"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-20 px-8 flex items-center justify-between border-b shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span>Management</span> <ChevronRight size={14} /> 
            <span className="text-slate-800 font-bold capitalize">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">
                {userRole === "admin" ? "Olushola Amosun" : "Staff"}
              </p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${userRole === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                <Shield size={10} /> {userRole}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 border ring-4 ring-blue-50">
              {userRole === "admin" ? "OA" : "ST"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 max-w-6xl w-full mx-auto">
          {globalMessage.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 font-semibold text-sm border ${globalMessage.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
              {globalMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{globalMessage.text}</span>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Create New Job Posting</h3>
              <form onSubmit={handleJobSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Job Title *</label>
                  <input required type="text" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. Senior Recruiter" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Company Name *</label>
                  <input required type="text" value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. Menokraft Ltd" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Location *</label>
                  <input required type="text" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. Lagos, Nigeria" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Salary Estimate Matrix</label>
                  <input type="text" value={jobForm.salary_range} onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. ₦400,000 - ₦600,000" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Job Deployment Type</label>
                  <select value={jobForm.job_type} onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })} className="w-full border bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none font-medium">
                    <option value="full time">Full Time</option>
                    <option value="part time">Part Time</option>
                    <option value="remote">Remote</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sector Category Tag</label>
                  <input type="text" value={jobForm.category} onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. Marketing, Engineering" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Detailed Operational Summary Description *</label>
                  <textarea required rows={4} value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} className="w-full border rounded-xl p-4 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="Outline duties here..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Role Requirements Criteria</label>
                  <textarea rows={3} value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} className="w-full border rounded-xl p-4 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="List criteria details..."></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button disabled={loading} type="submit" className="bg-blue-600 text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-600/10">
                    {loading && <Loader2 className="animate-spin" size={16} />} Publish Job Posting
                  </button>
                </div>
              </form>
            </div>
          )}

          {(activeTab === "applications" || activeTab === "international") && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white border p-4 rounded-xl shadow-sm">
                <div className="relative w-full lg:w-72">
                  <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search applicants or roles..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-xl bg-slate-50 outline-none text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sort Date:</span>
                    <select 
                      value={dateSortOrder} 
                      onChange={(e) => setDateSortOrder(e.target.value as "newest" | "oldest")}
                      className="border bg-slate-50 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Timeframe:</span>
                    <select 
                      value={dateRangeFilter} 
                      onChange={(e) => setDateRangeFilter(e.target.value as any)}
                      className="border bg-slate-50 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Category:</span>
                    <select 
                      value={categoryFilter} 
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="border bg-slate-50 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
                    >
                      {uniquelyFoundCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-6">Applicant Info</th>
                        <th className="py-4 px-6">Applied Position</th>
                        <th className="py-4 px-6">Date Applied</th>
                        <th className="py-4 px-6">Contact Number</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                            No processing applications found matching current metrics.
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-6">
                              <p className="font-bold text-slate-900">{app.full_name}</p>
                              <p className="text-xs text-slate-400">{app.email}</p>
                            </td>

                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg mr-2 uppercase tracking-wide">
                                {app.job_category || "General"}
                              </span>
                              <span className="text-slate-900 font-semibold">{app.job_title}</span>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                <Calendar size={13} className="text-slate-400" />
                                {formatDate(app.created_at)}
                              </div>
                            </td>

                            <td className="py-4 px-6 text-slate-500 font-mono text-xs">{app.phone_number}</td>

                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedApp(app)}
                                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs transition-colors"
                                >
                                  <Eye size={14} /> View Details
                                </button>
                                <a 
                                  href={getResumeUrl(app.resume_url)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  download
                                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs transition-colors"
                                >
                                  <FileDown size={14} /> Download
                                </a>

                                {userRole === "admin" && (
                                  <button 
                                    onClick={() => handleDeleteApplication(app.id)}
                                    disabled={loading}
                                    className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl text-xs transition-colors disabled:opacity-50"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "blogs" && userRole === "admin" && (
            <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Publish Content Article</h3>
              <form onSubmit={handleBlogSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Article Headline *</label>
                    <input required type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. Fostering Innovation" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Section Category *</label>
                    <input required type="text" value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="e.g. Culture, Strategy" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Author Credit Tag</label>
                    <input type="text" value={blogForm.author} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="Default: Admin" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Featured Image (Max 3MB)
                    </label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 3 * 1024 * 1024) {
                            alert("File size exceeds 3MB. Please upload a smaller image.");
                            e.target.value = ""; 
                            setImageFile(null);
                            return;
                          }
                          setImageFile(file);
                        }
                      }} 
                      className="w-full border rounded-xl px-4 py-2 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Complete Editorial Body *</label>
                  <textarea required rows={8} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full border rounded-xl p-4 bg-slate-50 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20" placeholder="Write or paste your article body here..."></textarea>
                </div>

                <div className="flex justify-end">
                  <button disabled={loading} type="submit" className="bg-blue-600 text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-600/10">
                    {loading && <Loader2 className="animate-spin" size={16} />} Post Article
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {selectedApp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedApp(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                  {selectedApp.job_category || "General"}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedApp.full_name}</h2>
                <p className="text-sm font-semibold text-slate-500">Applied for: <span className="text-slate-800">{selectedApp.job_title}</span></p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-3">
                  <Mail className="text-blue-600 shrink-0" size={18} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{selectedApp.email}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-3">
                  <Phone className="text-blue-600 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</p>
                    <p className="text-xs font-semibold text-slate-800">{selectedApp.phone_number || "Not provided"}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-3">
                  <Calendar className="text-blue-600 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Date</p>
                    <p className="text-xs font-semibold text-slate-800">{formatDate(selectedApp.created_at)}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-3">
                  <User className="text-blue-600 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application ID</p>
                    <p className="text-xs font-semibold text-slate-800">#{selectedApp.id}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cover Letter / Intro statement</h4>
                <div className="p-4 bg-slate-50 border rounded-xl text-sm leading-relaxed text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto font-normal">
                  {selectedApp.cover_letter || "No cover letter submitted."}
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50/50 flex items-center justify-between">
              {userRole === "admin" ? (
                <button
                  onClick={() => handleDeleteApplication(selectedApp.id)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl text-xs transition-colors"
                >
                  <Trash2 size={16} /> Delete Candidate
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">Delete capability restricted</span>
              )}

              <div className="flex gap-2">
                <a 
                  href={getResumeUrl(selectedApp.resume_url)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/10"
                >
                  <FileDown size={16} /> Download Resume Document
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;