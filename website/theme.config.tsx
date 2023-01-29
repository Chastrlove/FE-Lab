import { useConfig } from "nextra-theme-docs";

export default {
  logo: <span>Chastrlove Labs</span>,
  project: {
    link: "https://github.com/Chastrlove/FE-Lab",
  },
  feedback: {
    content: "Question? Give us feedback →",
    labels: "feedback",
    useLink() {
      const config = useConfig();
      return `https://google.com/search?q=${encodeURIComponent(`Feedback for ${config.title}`)}`;
    },
  },
  docsRepositoryBase: "https://github.com/Chastrlove/FE-Lab/blob/website",
};
