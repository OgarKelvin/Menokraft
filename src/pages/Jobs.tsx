import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Briefcase, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import type { Job } from "@/data/jobs"; 
import { Button } from "@/components/ui/button";

const categoryLabels: Record<string, string> = {
  "Human-resources": "Human Resources",
  "Outsourcing": "Outsourcing",
  "Training": "Training",
  "Consulting": "Consulting",
  "Engineering": "Engineering",
  "Finance": "Finance",
  "Marketing": "Marketing",
  "Operations": "Operations",
  "Other": "Other",
};

const categories = [
  "Human-resources", "Outsourcing", "Training", "Consulting",
  "Engineering", "Finance", "Marketing", "Operations", "Other",
];

// Helper function to turn a job title into a URL-friendly slug
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const Jobs = () => {
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  // Fetch real jobs from the backend API using relative production path
  useEffect(() => {
    let isMounted = true;
    fetch("/api/jobs")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch available job positions");
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        
        if (Array.isArray(data)) {
          // Map MySQL database snake_case keys safely and attach generated slug properties if needed
          const normalizedJobs = data.map((dbJob: any): Job => ({
            id: dbJob.id,
            title: dbJob.title || "Untitled Position",
            company: dbJob.company || "Menokraft Services",
            location: dbJob.location || "Remote",
            category: dbJob.category || "Other",
            description: dbJob.description || "",
            type: dbJob.type || dbJob.job_type || "Full Time",
            salary_range: dbJob.salary_range || "Not Specified",
            requirements: dbJob.requirements || "",
            is_active: dbJob.is_active !== undefined ? dbJob.is_active : true,
            created_at: dbJob.created_at || "",
            updated_at: dbJob.updated_at || "",
            slug: generateSlug(dbJob.title || "job"),
          } as unknown as Job));
          setJobsList(normalizedJobs);
        } else {
          setJobsList([]);
          setError("Received invalid data format from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error loading frontend jobs:", err);
        setError(err.message || "An unknown network error occurred.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Safe Location extraction
  const locations = Array.isArray(jobsList) 
    ? [...new Set(jobsList.map((j) => j?.location).filter(Boolean))] 
    : [];

  // Safe filtering logic protecting against any undefined/null entries
  const filtered = Array.isArray(jobsList) 
    ? jobsList.filter((job) => {
        if (!job) return false;
        
        const jobTitle = job.title || "";
        const jobDesc = job.description || "";
        
        const matchSearch =
          !search ||
          jobTitle.toLowerCase().includes(search.toLowerCase()) ||
          jobDesc.toLowerCase().includes(search.toLowerCase());
          
        const matchCategory = category === "all" || job.category === category;
        const matchLocation = location === "all" || job.location === location;
        
        return matchSearch && matchCategory && matchLocation;
      })
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container px-4 md:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase size={28} className="text-primary-foreground/70" />
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
                Find Jobs
              </h1>
            </div>
            <p className="text-primary-foreground/70 max-w-lg">
              Browse open positions and take the next step in your career with Menokraft Services.
            </p>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="bg-card border-b sticky top-16 z-40">
          <div className="container px-4 md:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  disabled={loading || !!error}
                />
              </div>
              
              <Select value={category} onValueChange={setCategory} disabled={loading || !!error}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabels[cat] || cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={location} onValueChange={setLocation} disabled={loading || !!error}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-10">
          <div className="container px-4 md:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="animate-spin" size={40} />
                <p className="text-sm font-medium">Fetching available career opportunities...</p>
              </div>
            ) : error ? (
              <div className="max-w-md mx-auto my-10 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3 font-semibold justify-center">
                <AlertCircle size={20} className="shrink-0" />
                <span>Oops! {error}. Please check your connection.</span>
              </div>
            ) : filtered.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  {filtered.length} position{filtered.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((job) => (
                    <JobCard key={job.id || Math.random()} job={job} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <Briefcase size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="https://whatsapp.com/channel/0029VbBE7qj0G0XkqK8M4k1S" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Join our WhatsApp Community <ArrowRight size={16} />
            </a>   
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;