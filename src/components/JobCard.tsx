import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/data/jobs";

interface JobCardProps {
  job: Job;
}

const typeColors: Record<string, string> = {
  "full-time": "bg-accent/10 text-accent border-accent/20",
  "part-time": "bg-muted text-muted-foreground",
  contract: "bg-primary/10 text-primary border-primary/20",
  internship: "bg-muted text-muted-foreground",
};

const formatCategory = (cat: string) =>
  cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Helper function to turn a job title into a URL slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-md hover:border-accent/20 transition-all group">
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="outline" className={typeColors[job.type] || ""}>
          {job.type.replace("-", " ")}
        </Badge>
        <Badge variant="secondary">{formatCategory(job.category)}</Badge>
      </div>

      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
        {job.title}
      </h3>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {new Date(job.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {job.description}
      </p>

      {job.salary_range && (
        <p className="text-sm font-semibold text-foreground mb-4">{job.salary_range}</p>
      )}

      <Button asChild variant="outline" size="sm">
        <Link to={`/jobs/${createSlug(job.title)}`}>
          View Details <ArrowRight size={14} className="ml-1" />
        </Link>
      </Button>
    </div>
  );
};

export default JobCard;