import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  subject: z.string().max(200).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

type FormData = z.infer<typeof schema>;

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.name,
          email: data.email,
          serviceType: data.subject || "Website Contact Inquiry",
          details: data.message,
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        setSubmitted(true);
        reset(); // Clear form fields
      } else {
        toast({
          title: "Failed to send message",
          description: resData.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Contact form submission error:", err);
      toast({
        title: "Connection Error",
        description: "Could not connect to the backend server.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
              Contact Us
            </h1>
            <p className="text-primary-foreground/70 mt-2 max-w-lg">
              Have questions? We'd love to hear from you. Send us a message or visit our office.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Address</h3>
                      <p className="text-muted-foreground text-sm">
                        5 Ajose Street, Ajao Estate, Lagos State
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <a href="tel:+2347034732552" className="text-muted-foreground text-sm hover:text-accent transition-colors">
                        (+234) 703 473 2552
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <a href="mailto:info@menokraftservices.com" className="text-muted-foreground text-sm hover:text-accent transition-colors">
                        info@menokraftservices.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border aspect-video">
                  <iframe
                    title="Menokraft Services Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952764985!2d3.3158!3d6.5561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d7e1e0e0001%3A0x0!2s5+Ajose+Street%2C+Ajao+Estate%2C+Lagos+State!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <CheckCircle2 size={48} className="text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground text-sm">
                      Thank you for reaching out. Your message has been delivered to our team and we'll get back to you shortly.
                    </p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <h2 className="text-xl font-bold text-foreground">Send a Message</h2>

                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" {...register("name")} placeholder="Your name" />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" {...register("subject")} placeholder="What's this about?" />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" {...register("message")} placeholder="Your message..." rows={5} />
                      {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;