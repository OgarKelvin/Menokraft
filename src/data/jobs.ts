export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  category: string;
  salary_range: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const sampleJobs: Job[] = [
  {
    id: "1",
    title: "HR Business Partner",
    description:
      "We are looking for an experienced HR Business Partner to align business objectives with employees and management. You will serve as a consultant to management on human resource-related issues, acting as an employee champion and change agent.",
    requirements:
      "Bachelor's degree in Human Resources or related field\n5+ years of HR experience\nStrong knowledge of Nigerian labour laws\nExcellent communication and interpersonal skills",
    location: "Lagos, Nigeria",
    type: "full-time",
    category: "human-resources",
    salary_range: "₦350,000 - ₦500,000",
    is_active: true,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-01T09:00:00Z",
  },
  {
    id: "2",
    title: "Safety Officer",
    description:
      "Responsible for ensuring workplace health and safety compliance across project sites. Conduct risk assessments, safety audits, and deliver toolbox talks to site teams.",
    requirements:
      "NEBOSH IGC or equivalent certification\n3+ years experience in HSE roles\nKnowledge of ISO 45001\nStrong reporting skills",
    location: "Abuja, Nigeria",
    type: "full-time",
    category: "consulting",
    salary_range: "₦250,000 - ₦400,000",
    is_active: true,
    created_at: "2026-02-20T09:00:00Z",
    updated_at: "2026-02-20T09:00:00Z",
  },
  {
    id: "3",
    title: "Training Coordinator",
    description:
      "Coordinate and deliver professional training programs including IOSH, ISO, and soft skills courses. Manage training schedules, materials, and participant communications.",
    requirements:
      "Bachelor's degree in Education, HR, or related field\n2+ years in training coordination\nFamiliarity with ISO and IOSH frameworks\nExcellent organizational skills",
    location: "Lagos, Nigeria",
    type: "contract",
    category: "training",
    salary_range: "₦200,000 - ₦300,000",
    is_active: true,
    created_at: "2026-02-15T09:00:00Z",
    updated_at: "2026-02-15T09:00:00Z",
  },
  {
    id: "4",
    title: "Project Manager",
    description:
      "Lead and manage end-to-end project delivery for our clients. Oversee planning, execution, risk management, and stakeholder communication to ensure projects are delivered on time and within budget.",
    requirements:
      "PMP or PRINCE2 certification preferred\n5+ years of project management experience\nStrong leadership and communication skills\nProficiency in project management tools",
    location: "Port Harcourt, Nigeria",
    type: "full-time",
    category: "operations",
    salary_range: "₦400,000 - ₦600,000",
    is_active: true,
    created_at: "2026-02-10T09:00:00Z",
    updated_at: "2026-02-10T09:00:00Z",
  },
  {
    id: "5",
    title: "Recruitment Intern",
    description:
      "Support the recruitment team in sourcing candidates, screening CVs, scheduling interviews, and maintaining candidate databases. A great opportunity to learn HR recruitment practices.",
    requirements:
      "Currently studying or recently graduated in HR, Business, or related field\nStrong attention to detail\nGood communication skills\nProficiency in MS Office",
    location: "Lagos, Nigeria",
    type: "internship",
    category: "human-resources",
    salary_range: "₦80,000 - ₦120,000",
    is_active: true,
    created_at: "2026-03-05T09:00:00Z",
    updated_at: "2026-03-05T09:00:00Z",
  },
  {
    id: "6",
    title: "ISO Auditor",
    description:
      "Conduct internal and external audits for ISO 9001, ISO 14001, and ISO 45001 management systems. Prepare audit reports and recommend corrective actions to clients.",
    requirements:
      "Lead Auditor certification in ISO 9001/14001/45001\n4+ years of auditing experience\nExcellent analytical and report writing skills\nWillingness to travel",
    location: "Lagos, Nigeria",
    type: "contract",
    category: "consulting",
    salary_range: "₦300,000 - ₦450,000",
    is_active: true,
    created_at: "2026-02-25T09:00:00Z",
    updated_at: "2026-02-25T09:00:00Z",
  },
];
