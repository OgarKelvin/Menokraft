import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Banknote, Loader2, AlertCircle, Briefcase } from "lucide-react";
import type { Job } from "@/data/jobs";

const formatCategory = (cat: string) => {
  if (!cat) return "";
  return cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const JobDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setLoading(true);

    // Call the backend slug endpoint matching server.js
    const apiUrl = window.location.hostname === 'localhost' 
      ? `http://localhost:5000/api/jobs/slug/${slug}`
      : `/api/jobs/slug/${slug}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Job position not found");
          }
          throw new Error("Failed to load job details");
        }
        return res.json();
      })
      .then((dbJob) => {
        if (!isMounted) return;

        if (dbJob) {
          const normalizedJob: Job = {
            id: dbJob.id,
            title: dbJob.title || "Untitled Position",
            company: dbJob.company || "Menokraft Services",
            location: dbJob.location || "Remote",
            category: dbJob.category || "other",
            description: dbJob.description || "",
            type: dbJob.type || dbJob.job_type || "Full Time",
            salary_range: dbJob.salary_range || "",
            requirements: dbJob.requirements || "",
            is_active: dbJob.is_active !== undefined ? dbJob.is_active : true,
            created_at: dbJob.created_at || new Date().toISOString(),
            updated_at: dbJob.updated_at || new Date().toISOString(),
          } as unknown as Job;

          setJob(normalizedJob);
        } else {
          setJob(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error loading job details:", err);
        setError(err.message || "An error occurred while retrieving job details.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary py-10">
          <div className="container px-4 md:px-8">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Back to Jobs
            </Link>
            
            {!loading && !error && job && (
              <>
                <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-3">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary">{job.type.replace("-", " ")}</Badge>
                  <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground">
                    {formatCategory(job.category)}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className="py-10">
          <div className="container px-4 md:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="animate-spin" size={40} />
                <p className="text-sm font-medium">Loading position specifications...</p>
              </div>
            ) : error ? (
              <div className="max-w-md mx-auto my-10 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3 font-semibold justify-center">
                <AlertCircle size={20} className="shrink-0" />
                <span>Oops! {error}.</span>
              </div>
            ) : job ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} /> Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {job.salary_range && (
                      <span className="flex items-center gap-1.5">
                        <Banknote size={16} /> {job.salary_range}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3">Job Description</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements && (
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">Requirements</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {job.requirements}
                      </p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-card border rounded-lg p-6 sticky top-24">
                    <ApplicationForm jobId={job.id} jobTitle={job.title} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Briefcase size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Job position not found</h3>
                <p className="text-muted-foreground">The job details you are looking for may have expired or been removed.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;