// Central site configuration — firm details, navigation, contact.
export const site = {
  name: "P. R. Kumar & Co.",
  tagline: "Chartered Accountants · Advisory | Assurance | Tax",
  established: 1981,
  stats: { staff: "45+", partners: 6, practiceAreas: 4 },
  contact: {
    address: "C-2/4 Safdarjung Development Area, Main Aurobindo Marg, New Delhi — 110016",
    phone: "+91 (11) 4711 8888",
    email: "prkumar@prkumar.in",
  },
  // Replace hrefs with the firm's real profiles when available.
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "X (Twitter)", href: "https://x.com/", icon: "x" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Practice Areas",
      href: "/practice-areas",
      children: [
        { label: "Assurance & Advisory", href: "/practice-areas/assurance-advisory" },
        { label: "Tax Advisory", href: "/practice-areas/tax-advisory" },
        { label: "Business Advisory", href: "/practice-areas/business-advisory" },
        { label: "Management Advisory", href: "/practice-areas/management-advisory" },
      ],
    },
    { label: "Leadership", href: "/leadership" },
    { label: "Experience", href: "/experience" },
    {
      label: "Thought Leadership",
      href: "/thought-leadership",
      children: [
        { label: "Partner Quotes", href: "/thought-leadership/quotes" },
        { label: "Resources", href: "/thought-leadership/resources" },
        { label: "Recent Blogs", href: "/thought-leadership/blogs" },
      ],
    },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
