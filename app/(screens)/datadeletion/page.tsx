"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { Background } from "../auth/components/Background";

const dataDeletionContent = {
  title: "Data Deletion Instructions",
  sections: [
    {
      title: "Account Deletion Process",
      content:
        "If you would like to delete your BaybayInscribe account and remove your personal data, please follow the steps below:",
    },
    {
      title: "Step 1: Log In",
      content: "Log in to your account at https://dev.baybayinscribe.top.",
    },
    {
      title: "Step 2: Access Settings",
      content: "Navigate to Profile Settings from the sidebar options.",
    },
    {
      title: "Step 3: Delete Account",
      content: "Click Delete Account and confirm your decision.",
    },
    {
      title: "Manual Deletion Request",
      content:
        'If you are unable to log in or wish to request account deletion manually, please contact us at 📧 gilasbaybayinscribe@gmail.com with the subject: "Delete my Account".',
    },
  ],
};

export default function DataDeletion() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Head>
        <title>Data Deletion | BaybayInscribe</title>
        <meta
          name="description"
          content="Learn how to delete your BaybayInscribe account and remove your personal data. Follow our step-by-step guide for account deletion."
        />
        <meta
          name="keywords"
          content="BaybayInscribe, Data Deletion, Account Deletion, Privacy, Data Protection"
        />
        <meta property="og:title" content="Data Deletion | BaybayInscribe" />
        <meta
          property="og:description"
          content="Learn how to delete your BaybayInscribe account and remove your personal data. Follow our step-by-step guide for account deletion."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://baybayinscribe.com/data-deletion" />
      </Head>

      <Background>
        <main
          className="flex-1 bg-gradient-to-b from-blue-900/5 via-blue-900/10 to-blue-900/5 py-12 px-4 relative z-10"
          role="main"
          aria-label="Data Deletion Instructions"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto max-w-4xl"
          >
            <Card className="backdrop-blur-sm bg-neutral-white/80 dark:bg-neutral-black/80 border-blue-300/50 shadow-xl relative z-20">
              <CardHeader className="space-y-4 pb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center relative"
                >
                  <div className="absolute -top-16 -right-16 w-32 h-32 transform rotate-12">
                    <Image
                      src="/images/ButtyRead.webp"
                      alt="Butty reading data deletion instructions"
                      width={128}
                      height={128}
                      className="object-contain opacity-90"
                      priority
                    />
                  </div>
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    {dataDeletionContent.title}
                  </CardTitle>
                  <p className="mt-4 text-muted-foreground">
                    Last updated:{" "}
                    <time dateTime={new Date().toISOString()}>
                      {new Date().toLocaleDateString()}
                    </time>
                  </p>
                </motion.div>
              </CardHeader>
              <CardContent>
                <nav aria-label="Data Deletion Instructions">
                  <ol className="divide-y divide-blue-300/20">
                    {dataDeletionContent.sections.map((section, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="relative py-8 first:pt-0 last:pb-0"
                      >
                        <div
                          className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"
                          aria-hidden="true"
                        />
                        <div className="pl-6">
                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400/10 text-blue-400 font-semibold"
                              aria-hidden="true"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-400" />
                            </span>
                            <h2
                              className="text-2xl font-semibold text-blue-300"
                              id={`section-${index + 1}`}
                              tabIndex={0}
                              role="heading"
                              aria-level={2}
                            >
                              {section.title}
                            </h2>
                          </div>
                          <div
                            className="text-foreground/80 leading-relaxed pl-11"
                            tabIndex={0}
                            role="region"
                            aria-labelledby={`section-${index + 1}`}
                          >
                            <p>{section.content}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                </nav>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </Background>
    </>
  );
}
