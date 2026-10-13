import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Loader2, ChevronDown, ChevronUp } from "lucide-react";

// Typescript interface matching your MySQL table columns
interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  author?: string;
  image_url?: string;
  created_at: string;
}

const Blogs = () => {
  const [blogsList, setBlogsList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track expanded state for each blog by its unique ID
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch articles");
        }
        return res.json();
      })
      .then((data: Blog[]) => {
        setBlogsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading frontend blogs:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recent";
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http") ? imagePath : imagePath;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
              Blogs & Articles
            </h1>
            <p className="text-primary-foreground/70 mt-2 max-w-lg">
              Insights, tips, and thought leadership from the Menokraft team
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-8">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading latest articles...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-destructive font-medium">
                <p>Oops! {error}. Please ensure your backend server is running.</p>
              </div>
            )}

            {!loading && !error && blogsList.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No articles found in the database.</p>
              </div>
            )}

            {!loading && !error && blogsList.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogsList.map((blog) => {
                  const imageSrc = getImageUrl(blog.image_url);
                  const isExpanded = expandedIds.includes(blog.id);

                  return (
                    <article
                      key={blog.id}
                      className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    >
                      {/* Image container: switches from fixed height crop to full height/auto view when expanded */}
                      <div className={`bg-accent/15 flex items-center justify-center overflow-hidden relative transition-all duration-300 ${
                        isExpanded ? "h-auto max-h-[500px]" : "h-48"
                      }`}>
                        {imageSrc ? (
                          <img 
                            src={imageSrc} 
                            alt={blog.title} 
                            className={`w-full transition-all duration-300 ${
                              isExpanded ? "h-auto object-contain max-h-[500px]" : "h-full object-cover"
                            }`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-5xl font-extrabold text-accent/20 py-12">M</span>
                        )}
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded">
                              {blog.category || "General"}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar size={12} />
                              {formatDate(blog.created_at)}
                            </span>
                          </div>
                          
                          <h2 className="text-xl font-bold text-foreground mb-3">
                            {blog.title}
                          </h2>

                          {/* Content Display: Truncated or Full */}
                          <p className={`text-muted-foreground leading-relaxed whitespace-pre-line ${
                            isExpanded ? "" : "line-clamp-3"
                          }`}>
                            {isExpanded ? blog.content : (blog.excerpt || blog.content)}
                          </p>
                        </div>

                        {/* Read More / Show Less Toggle Button */}
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <button
                            onClick={() => toggleExpand(blog.id)}
                            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-semibold text-sm transition-colors cursor-pointer"
                          >
                            {isExpanded ? (
                              <>Show Less <ChevronUp size={16} /></>
                            ) : (
                              <>Read More <ChevronDown size={16} /></>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;