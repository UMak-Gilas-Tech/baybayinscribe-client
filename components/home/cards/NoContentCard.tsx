import React from "react";
import { Frown } from "lucide-react";

const CARD_STYLES = {
  container: "w-full flex-shrink-0",
  card: "h-44 sm:h-52 flex flex-col items-center justify-center bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-lg border border-dashed border-border shadow-inner px-8 py-6 transition-all duration-300 hover:shadow-md  hover:cursor-not-allowed",
  icon: {
    wrapper: "mb-1 p-2 rounded-full bg-secondary/20",
    base: "w-10 h-10 sm:w-12 sm:h-12 text-grey-300/70 transition-transform duration-300 group-hover:scale-110",
  },
  title: "text-card-foreground font-semibold text-lg sm:text-xl mb-1",
  description:
    "text-grey-300 text-base sm:text-lg text-center max-w-xs sm:max-w-sm leading-normal ",
} as const;

const MESSAGES = {
  lesson: {
    title: "No lessons available",
    description:
      "We're preparing exciting Baybayin lessons for you. Check back soon to start your learning journey!",
  },
  quiz: {
    title: "No quizzes available",
    description:
      "New Baybayin quizzes are coming soon! Stay tuned to test your knowledge.",
  },
} as const;

interface NoContentCardProps {
  /** Type of content (lesson or quiz) */
  type: "lesson" | "quiz";
  /** Optional aria-label for the card. If not provided, will use the default title */
  ariaLabel?: string;
}

export function NoContentCard({ type, ariaLabel }: NoContentCardProps) {
  const content = MESSAGES[type];
  const cardId = `no-content-${type}`;

  return (
    <section
      className={CARD_STYLES.container}
      aria-label={ariaLabel || content.title}
      role="status"
      id={cardId}
    >
      <div className={CARD_STYLES.card} aria-live="polite">
        <div className={CARD_STYLES.icon.wrapper}>
          <Frown
            className={CARD_STYLES.icon.base}
            aria-hidden="true"
            role="presentation"
          />
        </div>
        <h2 className={CARD_STYLES.title}>{content.title}</h2>
        <p className={CARD_STYLES.description}>{content.description}</p>
      </div>
    </section>
  );
}
