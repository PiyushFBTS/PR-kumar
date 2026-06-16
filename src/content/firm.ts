// Single source of truth for the firm's marketing content.
// Used directly by the public (SSG) pages AND by prisma/seed.ts, so the
// database and the rendered site never drift apart.

export interface Partner {
  slug: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  phone: string | null;
  email: string | null;
  order: number;
  education?: string[];
  experience?: string[];
}

export interface PracticeArea {
  slug: string;
  name: string;
  leads: string[]; // partner names (rendered with a "Mr." prefix)
  summary: string;
  services: string[];
  order: number;
}

export const partners: Partner[] = [
  {
    slug: "p-k-agarwal",
    name: "P. K. Agarwal",
    role: "Mentor",
    credentials: "FCA · B.Com (University of Rajasthan)",
    bio: "Founder of P. R. Kumar & Co. (1981) and mentor to the practice — he heads the firm's tax advisory work and brings his values and decades of experience to every engagement.",
    phone: "+91 98711 84888",
    email: "pka@prkumar.in",
    order: 1,
    education: ["Chartered Accountant (FCA)", "Bachelor of Commerce, University of Rajasthan"],
    experience: [
      "P. K. Agarwal started P. R. Kumar & Co. in 1981 as a CA firm providing financial, management and tax advisory services to corporates and individuals.",
      "PKA brings to the company his values and principles which guide us, and vast experience in tax and advisory services.",
      "Along with managing the company, PKA heads our tax advisory practice and provides management and financial consulting to our clients.",
    ],
  },
  {
    slug: "rahul-kathuria",
    name: "Rahul Kathuria",
    role: "Assurance, Advisory and IT Consulting",
    credentials: "FCA · B.Com (Honours), University of Delhi",
    bio: "Heads the firm's assurance practice and pioneered its ERP/IT consulting initiative. Deep audit expertise across FMCG, technology, real estate and infrastructure.",
    phone: "+91 98716 69955",
    email: "rahul@prkumar.in",
    order: 3,
    education: [
      "Chartered Accountant (FCA)",
      "Bachelor of Commerce (Honours), University of Delhi",
    ],
    experience: [
      "Rahul joined P. R. Kumar in 1995 and heads our assurance practice, assisting companies in the implementation of ERP systems in their organizations.",
      "He pioneered our ERP initiative and has successfully implemented these solutions in a reputed FMCG company and an auto and engineering sector company.",
      "Rahul has extensive experience and expertise in providing statutory audit, tax audit, management and internal control audit services across the FMCG, technology, real estate and infrastructure sectors.",
    ],
  },
  {
    slug: "ankit-agarwal",
    name: "Ankit Agarwal",
    role: "Managing Partner cum Tax & Business Advisory",
    credentials: "M.Fin (George Washington University) · FCA · B.Com (Hons), University of Delhi",
    bio: "Managing Partner with  20+ years in taxation and business advisory. Develops the firm's business advisory and income-tax practice; previously with Baker & McKenzie Consulting LLC, USA.",
    phone: "+91 98711 77600",
    email: "ankit@prkumar.in",
    order: 2,
    education: [
      "Masters in Finance, George Washington University, USA",
      "Chartered Accountant (FCA)",
      "Bachelor of Commerce (Honours), University of Delhi",
    ],
    experience: [
      "Ankit has assumed the responsibility of developing business advisory along with Income Tax Advisory services.",
      "He brings with him 20+ years' experience in Taxation, Assessment and Investigation as well as business advisory.",
      "Prior to joining P. R. Kumar, he worked with Baker & McKenzie Consulting LLC, USA and has undertaken various business advisory and international taxation projects.",
      "During his Masters, he specialised in forex management and hedging, derivative structuring & modelling, corporate finance and transaction services.",
    ],
  },
  {
    slug: "kundan-kumar-jha",
    name: "Kundan Kumar Jha",
    role: "Business Advisory, Due Diligence & GST",
    credentials: "FCA · B.Com, University of Delhi",
    bio: "Brings 20+ years of assurance experience; ex-PricewaterhouseCoopers. Works across corporate taxation, financial due diligence and ESG/sustainability reporting.",
    phone: "+91 11 4711 8888",
    email: "kundan.jha@prkumar.in",
    order: 4,
    education: ["Chartered Accountant (FCA)", "Bachelor of Commerce, University of Delhi"],
    experience: [
      "Kundan brings 20+ years of divergent experience in assurance. He joined P. R. Kumar & Co. in 2010 and has been involved in assurance and corporate taxation.",
      "Prior to joining P. R. Kumar & Co., Kundan was working with PricewaterhouseCoopers, where he worked in the assurance department and was involved with finalisation of annual financials and limited reviews of leading corporate houses.",
      "Kundan has also worked on corporate taxation, financial due diligence, internal control mechanisms and project capitalisation.",
      "Kundan has taken up Environment, Social and Governance (ESG) reporting under climate change and sustainability reporting, which will apply to organisations at all levels very shortly.",
    ],
  },
  {
    slug: "deepak-srivastava",
    name: "Deepak Srivastava",
    role: "Audit and Assurance",
    credentials: "FCA · B.Com, University of Delhi",
    bio: "With the firm since 1991, handling audit, assurance and ERP assignments for key clients. Expertise across FMCG, engineering and technology audits, and an integral part of our management advisory practice.",
    phone: "+91 11 4711 8888",
    email: "deepak.srivastava@prkumar.in",
    order: 5,
    education: ["Chartered Accountant (FCA)", "Bachelor of Commerce, University of Delhi"],
    experience: [
      "Deepak has been with P. R. Kumar & Co. since 1991 and handles audit, assurance and ERP assignments for key clients of our organization.",
      "Deepak has extensive experience and expertise in conducting statutory audits, tax audits, management and internal control audit services in the FMCG, engineering and technology sectors.",
      "He is also an integral part of our management advisory practice.",
    ],
  },
  {
    slug: "prabhash-kumar-jha",
    name: "Prabhash Kumar Jha",
    role: "Assurance & Due Diligence",
    credentials: "ACA · B.Com, LNMU",
    bio: "With the firm since 2009, handling assurance assignments for key clients. Audit experience across FMCG, QSR, dairy, real estate and the financial sector.",
    phone: "+91 11 4711 8888",
    email: "prabhash.jha@prkumar.in",
    order: 6,
    education: ["Chartered Accountant (ACA)", "Bachelor of Commerce, LNMU"],
    experience: [
      "Prabhash has been with P. R. Kumar & Co. since 2009 and handles various assurance assignments for key clients of our organization.",
      "Prabhash has extensive experience and expertise in providing statutory audit, tax audit, management and internal control audit services in the FMCG, QSR, dairy, real estate and other service industries, including the financial sector.",
    ],
  },
];

export const practiceAreas: PracticeArea[] = [
  {
    slug: "assurance-advisory",
    name: "Assurance & Advisory",
    leads: ["Rahul Kathuria", "Deepak Srivastava", "Prabhash Kumar Jha"],
    summary:
      "Single-source financial, process and management assurance — from statutory audit through specialised reviews and ESG reporting.",
    services: [
      "Statutory Audit",
      "Tax Audit",
      "Transfer Pricing Audit",
      "CAG Audit",
      "Bank Audit",
      "Limited Review",
      "Special Purpose Financial Reporting",
      "ESG Audit",
    ],
    order: 1,
  },
  {
    slug: "tax-advisory",
    name: "Tax Advisory",
    leads: ["Ankit Agarwal", "Kundan Kumar Jha"],
    summary:
      "Direct and indirect tax advisory, planning, compliance and litigation — including representation before the tax authorities.",
    services: [
      "Income Tax Advisory",
      "Search & Seizure Litigation",
      "Tax Planning",
      "Filing of Returns",
      "GST Advisory",
      "GST Return Filing",
      "GST Transition Planning",
      "Appearances before Tax Authorities",
    ],
    order: 2,
  },
  {
    slug: "business-advisory",
    name: "Business Advisory",
    leads: ["Rahul Kathuria", "Ankit Agarwal", "Kundan Kumar Jha"],
    summary:
      "Management consulting, due diligence and strategy that turn financial insight into business decisions.",
    services: [
      "Management Consulting",
      "Due Diligence",
      "Strategy Consulting",
      "Internal Audit",
      "Management & System Audit",
      "Policy Analysis",
    ],
    order: 3,
  },
  {
    slug: "management-advisory",
    name: "Management Advisory",
    leads: ["Rahul Kathuria", "Kundan Kumar Jha"],
    summary:
      "ERP consulting and process optimisation — evaluating, implementing and standardising the systems that run the business.",
    services: [
      "ERP Vendor Advisory",
      "Implementation Assistance",
      "Report Design",
      "Business Process Optimisation",
      "Business Process Standardisation",
      "IT Function Advisory",
      "Post-implementation Support",
    ],
    order: 4,
  },
];

export const firmValues = [
  {
    title: "Trusted, long-term advisor",
    body: "We build relationships that last — acting as a single, dependable source for financial, process and management assurance.",
  },
  {
    title: "Single-source breadth",
    body: "Audit, direct and indirect tax, due diligence, forensic investigation and ERP — delivered by one cross-functional team.",
  },
  {
    title: "Domain depth",
    body: "Decades of sector experience across FMCG, retail, dairy, QSR, real estate and infrastructure.",
  },
  {
    title: "Independence & integrity",
    body: "Objective, evidence-led work that stands up to scrutiny — from statutory audit to search-and-seizure litigation.",
  },
];

export interface PartnerQuote {
  slug: string;
  partner: string;
  role: string;
  quote: string;
}

// Curated partner quotes shown on Thought Leadership → Partner Quotes.
// Mentor (P. K. Agarwal) is rendered first.
export const partnerQuotes: PartnerQuote[] = [
  {
    slug: "p-k-agarwal",
    partner: "P. K. Agarwal",
    role: "Mentor & Founder",
    quote:
      "In four decades, one thing has never changed: a client's trust is earned one honest opinion at a time.",
  },
  {
    slug: "ankit-agarwal",
    partner: "Ankit Agarwal",
    role: "Income Tax & Business Advisory",
    quote:
      "The best tax planning is quiet and early — done long before a deadline ever forces a decision.",
  },
  {
    slug: "rahul-kathuria",
    partner: "Rahul Kathuria",
    role: "Assurance & IT Consulting",
    quote:
      "Assurance and good systems pull in the same direction: a business you can actually measure and trust.",
  },
  {
    slug: "kundan-kumar-jha",
    partner: "Kundan Kumar Jha",
    role: "Assurance, Due Diligence & GST",
    quote:
      "Due diligence is the art of seeing clearly — the numbers, the risks, and the impact a business leaves behind.",
  },
  {
    slug: "deepak-srivastava",
    partner: "Deepak Srivastava",
    role: "Internal & Forensic Audit",
    quote: "An audit is only as valuable as the questions it is brave enough to ask.",
  },
  {
    slug: "prabhash-kumar-jha",
    partner: "Prabhash Kumar Jha",
    role: "Assurance & Due Diligence",
    quote:
      "Detail is not the enemy of speed — it is what lets you move fast without ever looking back.",
  },
];

// Public-safe sector list (no named clients — see IMPLEMENTATION_PLAN.md §9.6).
export const sectors = [
  "FMCG",
  "Retail",
  "Dairy",
  "QSR",
  "Garment",
  "Real Estate",
  "Infrastructure",
  "Banking & Financial Services",
];

export const firmHistory = {
  founded: 1981,
  founder: "P. K. Agarwal",
  intro:
    "P. R. Kumar & Co. is a New Delhi firm of Chartered Accountants founded in 1981. From a tax advisory practice it has grown into a 45+ member firm with six partners, serving corporates, banks, investment institutions and SMEs in the middle market.",
  mission1:
    "We aim to provide assurance, tax advisory, due diligence, management and investment advisory to corporates, individuals and institutions.",
  mission2:
    "Our goal is to be a trusted, objective and long term advisor to corporates, banks, investment institutions and SMEs. We want to be known as the leading provider of these services in the middle market.",
  mission3:
    "We aim to foster a rewarding culture among our people grounded on teamwork, thought leadership and alignment of firm's Values with its strategic objective.",
};
