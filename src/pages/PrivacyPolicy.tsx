import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Award, TrendingUp } from "lucide-react";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">
              Privacy Policy
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-8">
             <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                  Privacy Policy
                </p>
              <div>
             <div>
            <h2 className="text-3xl font-extrabold text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                1. Introduction and Commitment to Data Protection
            </h2>
                <p className="text-1xl-foreground leading-relaxed mb-4">
                 Menokraft Services Limited values your trust and is committed to protecting your personal data. We process all personal information in compliance with applicable data protection laws, including the <strong>Nigeria Data Protection Regulation (NDPR) 2019, Protection of Personal Information Act (POPIA) 2013,</strong> alongside any relevant national legislation. 
                </p>
                <p className="text-1xl-foreground leading-relaxed mb-4">
                  This Privacy Policy explains how we collect, use, store, and protect your personal data, as well as your rights regarding such data.
                </p>
              </div>
              </div>
              <hr/>
              {/* second Policy section Paragraph section */}
               <div>
                <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1" >
                  2. Definition and Scope of Personal Data
                </h2>
                <p className="text-1xl-foreground leading-relaxed mb-4">
                 Personal data refers to any information that identifies or can be used to identify an individual. This includes, but is not limited to:
                 </p>
                 <div> 
                 <ul className="list-disc pl-5 space-x-7">
                  <li className="ml-7">Full name </li>
                  <li>Contract details (email address, phone number, residential address)</li>
                  <li>Date of birth</li>
                  <li>Employement and educational history</li>
                  <li>Online identifiers such as IP address</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                  Information that cannot be linked to an identifiable individual is classified as anonymous data and is not subject to this policy.
                 </p>
                 </div>
                <hr/>
              </div>
                  {/* Third Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                  3. Nature of Services and Data Collection Activities
                </h2>
                 <p className="text-1xl-foreground leading-relaxed mb-4">
                Menokraft Services Limited operates as a professional HR consulting and business support firm. In the course of providing services, we may collect and process personal data through:
                 </p>
                 <div> 
                  <ul className="list-disc pl-5 space-x-7">
                  <li className="ml-7">Client on boarding and service delivery processes </li>
                  <li>Training programs and consulting engagements</li>
                  <li>Job applications and recruitment activities</li>
                  <li>Website interactions and digital platforms</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                  All data collection is carried out lawfully, fairly, and transparently.
                  </p>
                  </div>
                  <hr/>

                   {/* Fourth Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                 4. Purpose and Legal Basis for Data Processing
                </h2>
                 <p className="text-1xl-foreground leading-relaxed mb-4">
                    We process personal data for specific, legitimate purposes, including:                 </p>
                    
                 <div> 
                  <ul className="list-disc pl-5 space-x-7 space-y-2">
                  <li className="ml-7"><strong>Service Delivery:</strong> Facilitating HR consulting, recruitment, and business development services </li>
                  <li><strong>Client Relationship Management:</strong> Communicating updates, opportunities, and service-related information</li>
                  <li><strong>Marketing and Communication:</strong> Sending newsletters or promotional materials (based on consent or legitimate interest)</li>
                  <li><strong>Recruitment Processes:</strong>  Reviewing and managing job applications</li>
                  <li><strong>Legal and Regulatory Compliance:</strong> Meeting statutory, tax, and contractual obligations</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                  Each processing activity is supported by a lawful basis such as consent, contractual necessity, legal obligation, or legitimate interest.
                  </p>
                  </div>
<hr/>

                {/* Fifth Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                 5. Data Sharing and Third-Party Disclosure
                </h2>
                 <p className="text-1xl-foreground leading-relaxed mb-4">
                   We may share personal data with trusted third parties only when necessary, including:              </p>
                 <div> 
                  <ul className="list-disc pl-5 space-x-7 space-y-2">
                  <li className="ml-7">Service providers supporting operations (e.g., IT services, training platforms, payment processors) </li>
                  <li>Regulatory authorities where required by law</li>
                  <li>Marketing partners, strictly based on user consent</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                 All third-party processors are required to adhere to strict data protection standards through contractual agreements.
                  </p>
                  </div>
<hr/>
 {/* Sixth Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                 6. Data Storage, Retention, and Disposal
                </h2>
                 <p className="text-1xl-foreground leading-relaxed mb-4">
                   Personal data is retained only for as long as necessary to fulfill the purpose for which it was collected. Retention periods may be extended where required by:             </p>
                 <div> 
                  <ul className="list-disc pl-5 space-x-7 space-y-2">
                  <li className="ml-7">Legal or regulatory obligations </li>
                  <li>Financial and tax record-keeping requirements</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                Once data is no longer needed, it is securely deleted or anonymized to prevent unauthorized access or reuse.
                  </p>
                  </div>
<hr/>
{/* Seventh Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                 7.Cookies, Tracking Technologies, and Online Analytics
                </h2>
                 <p className="text-1xl-foreground leading-relaxed mb-4">
                    We use cookies and similar technologies to enhance user experience and analyze website performance. These include:

                </p>
                    
                 <div> 
                  <ul className="list-disc pl-5 space-x-7 space-y-2">
                  <li className="ml-7"><strong>Session Cookies:</strong> Temporary cookies that expire when the browser is closed </li>
                  <li><strong>Persistent Cookies:</strong> Stored for future visits to remember preferences</li>
                  <li><strong>Third-Party Cookies:</strong> Used for analytics and marketing purposes</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
           We may also use tools such as Google Analytics and advertising platforms for insights and remarketing. Users can control cookie preferences through browser settings.
                  </p>
                  </div>
<hr/>
 {/* Eight Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                 8. Data Security Measures
                </h2>
                 <p className="text-1xl-foreground leading-relaxed mb-4">
                   We implement appropriate technical and organizational safeguards to protect personal data against unauthorized access, loss, misuse, or disclosure. These measures include:             </p>
                 <div> 
                  <ul className="list-disc pl-5 space-x-7 space-y-2">
                  <li className="ml-7">Secure servers and encrypted data transmission (HTTPS) </li>
                  <li>Access controls and authentication systems</li>
                  <li>Regular system monitoring and updates</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                Despite these measures, no system is completely secure, and we continuously strive to improve our security practices.


                  </p>
                  </div>
<hr/>
 {/* Nineth Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                 9. Rights of Data Subjects
                </h2>
                 <p className="text-1xl-foreground leading-relaxed mb-4">
                  As a data subject, you have the following rights:             </p>
                 <div> 
                  <ul className="list-disc pl-5 space-x-7 space-y-2">
                  <li className="ml-7">Right to access your personal data </li>
                  <li>Right to correct or update inaccurate information</li>
                  <li>Right to request deletion of your data</li>
                 <li>Right to restrict or object to processing</li>
                  <li>Right to data portability</li>
                  <li>Right to withdraw consent at any time</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                Requests to exercise these rights can be made via our official contact channels. You also have the right to lodge complaints with relevant data protection authorities.


                  </p>
                  </div>
<hr/>
{/* Tenth Policy section Paragraph section */}
            <h2 className="text-3xl font-extrabold  text-gray-900 transition-all duration-300 cursor-pointer hover:text-cyan-400 hover:translate-x-1">
                 10.Additional Provisions (Children, Third-Party Links & Policy Updates)
                </h2>
                    
                 <div> 
                  <ul className="list-disc pl-5 space-x-7 space-y-2">
                  <li className="ml-7"><strong>Children’s Privacy: </strong>  Our services are not intended for individuals under the age of 16. Data relating to minors is only processed with parental or guardian consent.</li>
                  <li><strong>Third-Party Links:</strong>Our platforms may contain links to external websites. We are not responsible for their privacy practices.</li>
                  <li><strong>Policy Updates:</strong> This Privacy Policy may be revised periodically. Updated versions will be published with the effective date clearly stated.</li>
                </ul>
                <p className="mt-6 text-1xl-foreground leading-relaxed mb-4">
                  </p>
                  </div>
<hr/>
                </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;