export const skillsData = {
  categories: [
    { id: "all", name: "All Skills" },
    { id: "languages", name: "Programming Languages" },
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "database", name: "Database" },
    { id: "tools", name: "Tools & Technologies" }
  ],
  skills: [
    // Programming Languages
    {
      name: "Java",
      category: "languages",
      description: "Core Java, OOP principles, algorithms, and backend application development",
      tag: "Language"
    },
    {
      name: "Python",
      category: "languages",
      description: "Backend scripting, web application architecture, and data operations",
      tag: "Language"
    },
    {
      name: "JavaScript",
      category: "languages",
      description: "ES6+, asynchronous programming, DOM scripting, and frontend logic",
      tag: "Language"
    },
    {
      name: "SQL",
      category: "languages",
      description: "Relational database queries, schema design, joins, and data manipulation",
      tag: "Language"
    },

    // Frontend
    {
      name: "HTML",
      category: "frontend",
      description: "Semantic web markup, document structure, accessibility, and modern standards",
      tag: "Frontend"
    },
    {
      name: "CSS",
      category: "frontend",
      description: "Responsive layouts, Flexbox, CSS Grid, custom styling, and modern UI design",
      tag: "Frontend"
    },
    {
      name: "JavaScript",
      category: "frontend",
      description: "Client-side scripting, event handling, component interactivity, and API consumption",
      tag: "Frontend"
    },
    {
      name: "React.js",
      category: "frontend",
      description: "Reusable component architecture, hooks, state management, and SPA navigation",
      tag: "Frontend"
    },

    // Backend
    {
      name: "Django",
      category: "backend",
      description: "Python-based web framework, MVT architecture, ORM, and secure web services",
      tag: "Backend"
    },
    {
      name: "Node.js",
      category: "backend",
      description: "JavaScript server runtime, backend service architecture, and NPM ecosystem",
      tag: "Backend"
    },
    {
      name: "REST APIs",
      category: "backend",
      description: "RESTful architecture, CRUD endpoints, JSON serialization, and client-server integration",
      tag: "Backend"
    },

    // Database
    {
      name: "MySQL",
      category: "database",
      description: "Relational database management, table normalization, indexing, and data integrity",
      tag: "Database"
    },

    // Tools & Technologies
    {
      name: "Git",
      category: "tools",
      description: "Version control, branching, committing, repository management, and collaboration",
      tag: "Tool"
    },
    {
      name: "VS Code",
      category: "tools",
      description: "Primary development environment, extension workflows, debugging, and productivity",
      tag: "Tool"
    }
  ]
};

export default skillsData;
