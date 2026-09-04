export const projectsData = [
  {
    id: "yeast-production-system",
    slug: "yeast-production-system",
    title: "Yeast Production System",
    category: "Full Stack Web Application",
    tagline: "A web-based production management system with workflow, reporting, analysis, and data-management modules.",
    shortDescription: "A web-based production management system with workflow, reporting, analysis, and data-management modules.",
    featured: true,
    coverGradient: "linear-gradient(135deg, #F1F4FD 0%, #E8EDFB 50%, #DFE7FA 100%)",
    accentColor: "#6366F1",
    overview: "Built a web-based production management system designed to streamline fermentation monitoring, batch tracking, and production analytics. Implemented workflow, reporting, analysis, and data-management modules with backend APIs and structured database integration.",
    problem: "Managing manual production logs in industrial yeast fermentation causes operational latency, inconsistent batch records, and difficulty in generating timely analysis reports.",
    solution: "Designed a centralized Django web application with structured MySQL database tables, role-guided workflow stages, responsive search, and automated production reporting.",
    features: [
      "Built a web-based production management system",
      "Implemented workflow, reporting, analysis, and data-management modules",
      "Designed backend APIs and database integration using Django and MySQL",
      "Created a responsive interface with search and structured production tracking"
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Django", "MySQL"],
    developmentApproach: "Engineered normalized database schemas in MySQL, developed clean Django view controllers and API services, and designed a responsive frontend with structured search and data entry validation.",
    githubUrl: "https://github.com/Dhanush-M-05/yeast-production-system",
    liveUrl: ""
  },
  {
    id: "reverse-marketplace",
    slug: "reverse-marketplace",
    title: "Reverse Marketplace",
    category: "Full Stack Platform",
    tagline: "A platform where buyers post requirements and sellers submit quotations.",
    shortDescription: "A platform where buyers post requirements and sellers submit quotations.",
    featured: true,
    coverGradient: "linear-gradient(135deg, #F4F1FD 0%, #EDE8FB 50%, #E5DFF8 100%)",
    accentColor: "#7C3AED",
    overview: "Built a reverse marketplace platform enabling demand-driven procurement. Buyers create structured requirement posts and verified sellers submit itemized price quotations with transparent order management.",
    problem: "Traditional procurement models require buyers to search through fragmented catalogs with fixed pricing, while sellers lack direct visibility into active buyer demands.",
    solution: "Engineered a reverse marketplace platform with dual buyer-seller workflows, authentication, admin verification, and RESTful API integrations for requirements, quotations, and orders.",
    features: [
      "Built a reverse marketplace platform",
      "Implemented buyer and seller workflows",
      "Implemented seller approval and user authentication workflows",
      "Developed dynamic frontend components",
      "Integrated REST APIs"
    ],
    technologies: ["React.js", "HTML", "CSS", "Spring Boot"],
    developmentApproach: "Built reusable React component interfaces with state management, routing, and clean RESTful API integration for quotation submissions and authorization.",
    githubUrl: "https://github.com/Dhanush-M-05/reverse-marketplace",
    liveUrl: ""
  },
  {
    id: "campus-event-management",
    slug: "campus-event-management",
    title: "Campus Event Management System (NexEvent)",
    category: "Full Stack Campus Platform",
    tagline: "A full-stack campus event platform designed for students, organizers, and administrators.",
    shortDescription: "A full-stack campus event platform designed for students, organizers, and administrators.",
    featured: true,
    coverGradient: "linear-gradient(135deg, #F0F5FD 0%, #E6EDFB 50%, #DEE7F8 100%)",
    accentColor: "#4F46E5",
    overview: "Full-stack campus event management platform with role-based access for students, event organizers, and administrative faculty. Provides event discovery, approval workflows, schedule tracking, and attendee lists.",
    problem: "Campus events often rely on disparate notice boards, leading to low student participation, scheduling clashes, and manual attendance overhead.",
    solution: "Developed an integrated web platform with Spring Boot backend services and React frontend, supporting role-gated access, administrative event review, and real-time updates.",
    features: [
      "Built a full-stack campus event platform",
      "Role-based access for students, organizers, and administrators",
      "Event creation, approval, and management modules",
      "MySQL database integration"
    ],
    technologies: ["React.js", "HTML", "CSS", "Spring Boot", "MySQL"],
    developmentApproach: "Structured role-based routing and secure RESTful endpoints connecting React interfaces with Spring Boot micro-controllers and MySQL relational storage.",
    githubUrl: "https://github.com/Dhanush-M-05/campus-event-management",
    liveUrl: ""
  }
];

export default projectsData;
