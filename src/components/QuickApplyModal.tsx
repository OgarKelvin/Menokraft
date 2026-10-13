import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Upload } from "lucide-react";

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number;
  jobTitle: string;
}

const QuickApplyModal = ({ isOpen, onClose, jobId, jobTitle }: QuickApplyModalProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Use FormData to correctly package text data and file uploads for phpMyAdmin / backend storage
    const formData = new FormData();
    formData.append("job_id", jobId.toString());
    formData.append("job_title", jobTitle);
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("cover_letter", coverLetter);
    
    if (resumeFile) {
      formData.append("resume", resumeFile); // Key name must match backend upload handler (e.g., upload.single('resume'))
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        // Note: Do NOT set Content-Type header manually when using FormData. 
        // The browser automatically sets it to multipart/form-data with the correct boundary boundary string.
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      setMessage({ text: "Application submitted successfully! Our team will review it.", isError: false });
      
      // Clear form fields after success
      setFullName("");
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setResumeFile(null);

      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2500);
    } catch (err: any) {
      console.error("Submission error:", err);
      setMessage({ text: err.message || "An error occurred during submission.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-card border rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-1">Apply for Position</h2>
        <p className="text-sm text-accent font-medium mb-6">{jobTitle}</p>

        {message && (
          <div
            className={`p-3 rounded-lg mb-4 text-sm font-medium ${
              message.isError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Full Name *
            </label>
            <Input
              required
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Email Address *
            </label>
            <Input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Phone Number *
            </label>
            <Input
              type="tel"
              required
              placeholder="+234..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Upload Resume / CV (PDF, DOCX) *
            </label>
            <div className="border border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-accent transition-colors relative">
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload size={20} />
                <span className="text-xs">
                  {resumeFile ? resumeFile.name : "Click to browse or drag file here"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Cover Letter / Short Note
            </label>
            <Textarea
              rows={4}
              placeholder="Tell us why you are a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" size={16} />}
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickApplyModal;