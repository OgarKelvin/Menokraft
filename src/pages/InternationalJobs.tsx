import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight, MapPin, Briefcase, Loader2 } from "lucide-react";
import QuickApplyModal from "@/components/QuickApplyModal";

interface Job {
  id: number;
  title: string;
  location: string;
  job_type: string;
  description: string;
}

const InternationalJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ id: number; title: string } | null>(null);

  // Fetch the international jobs from the backend using relative production path
  useEffect(() => {
    fetch("/api/jobs/international")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
        }
      })
      .catch((err) => console.error("Error loading international jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyClick = (id: number, title: string) => {
    setSelectedJob({ id, title });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container px-4 md:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Globe size={28} className="text-primary-foreground/70" />
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
                Vacancies
              </h1>
            </div>
            <p className="text-primary-foreground/70 max-w-lg">
              Explore career opportunities with top employers around the world. We connect Nigerian talent with international roles.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No international vacancies available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-card border rounded-lg p-6 hover:shadow-lg hover:border-accent/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-accent font-semibold mb-2">
                        <Briefcase size={14} />
                        <span>{job.job_type}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{job.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{job.description}</p>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleApplyClick(job.id, job.title)}
                      >
                        Apply <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* General Open Spec CV placement */}
            {jobs.length > 0 && (
              <div className="text-center mt-12 bg-muted/50 rounded-lg p-8">
                <h2 className="text-xl font-bold text-foreground mb-3">
                  Looking for Placement?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Submit your CV and our recruitment team will match you with suitable opportunities worldwide.
                </p>
                <Button 
                  size="lg"
                  onClick={() => handleApplyClick(jobs[0].id, "General Placement Matching")}
                >
                  Submit Your CV <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {selectedJob && (
        <QuickApplyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}
    </div>
  );
};

export default InternationalJobs;