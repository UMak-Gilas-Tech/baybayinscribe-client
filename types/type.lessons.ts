import { learningResource, learningResourceModule } from "@/db/schema/learning-resources"

export type LearningResource = typeof learningResource.$inferSelect;
export type LearningResourceModule = typeof learningResourceModule.$inferSelect;