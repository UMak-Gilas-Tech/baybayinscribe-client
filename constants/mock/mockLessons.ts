import { LearningResource } from "@/types/type.lessons";

export const mockLessons: LearningResource[] = [
  {
    id: "intro-baybayin",
    title: "Introduction to Baybayin",
    description:
      "Learn the basics of Baybayin, the ancient Filipino writing system. This lesson covers the history, basic characters, and fundamental principles of Baybayin script.",
    created_by: "admin",
    is_visible: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "baybayin-writing",
    title: "Writing in Baybayin",
    description:
      "Master the art of writing in Baybayin. This lesson focuses on proper stroke order, character formation, and writing techniques.",
    created_by: "admin",
    is_visible: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "baybayin-reading",
    title: "Reading Baybayin",
    description:
      "Develop your skills in reading and interpreting Baybayin text. Learn to recognize characters and understand their combinations.",
    created_by: "admin",
    is_visible: true,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: "baybayin-advanced",
    title: "Advanced Baybayin",
    description:
      "Take your Baybayin skills to the next level with advanced concepts, including ligatures, special characters, and historical variations.",
    created_by: "admin",
    is_visible: true,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
  },
  {
    id: "baybayin-modern",
    title: "Modern Applications of Baybayin",
    description:
      "Discover how Baybayin is being used in contemporary contexts, from art and design to digital applications.",
    created_by: "admin",
    is_visible: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];
