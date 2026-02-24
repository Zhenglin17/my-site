export type Project = {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  url?: string;
};

export const allProjects: Project[] = [
  {
    slug: "portfolio",
    title: "Personal Portfolio",
    description:
      "A personal portfolio site built with Next.js, Tailwind CSS v4, and Framer Motion. Features particle animations, card hover effects, and a clean dark aesthetic.",
    date: "2025-01-15",
    url: "https://github.com/Zhenglin17",
  },
  {
    slug: "api-toolkit",
    title: "API Toolkit",
    description:
      "A lightweight TypeScript utility library for building RESTful APIs. Includes request validation, error handling middleware, and structured response formatting.",
    date: "2024-09-20",
    url: "https://github.com/Zhenglin17",
  },
  {
    slug: "data-pipeline",
    title: "Data Pipeline Framework",
    description:
      "A modular data processing pipeline framework. Supports parallel execution, retry logic, and pluggable data source connectors for flexible data workflows.",
    date: null,
    url: "https://github.com/Zhenglin17",
  },
];
