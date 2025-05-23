"use client";

import { useModuleStore } from "@/app/store/store.modules";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLessonContext } from "../../../LessonContext";
import ReactMarkdown from "react-markdown";
import remarkParse from "remark-parse";
import remarkBaybayin from "@/app/lib/remark-baybayin";
import axios from "axios";
// shadcn/ui imports
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ViewModule() {
  const { lesson_id, module_id } = useParams<{
    lesson_id: string;
    module_id: string;
  }>();
  const moduleStore = useModuleStore();
  const lessonContext = useLessonContext();
  const router = useRouter();

  const buttonElement = useRef<HTMLButtonElement>(null);

  const [loadingMarkdown, setLoadingMarkdown] = useState(true);
  const [markdown, setMarkdown] = useState<string>(
    "You aren't supposed to see this"
  );
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (lesson_id && module_id) {
      moduleStore.getModule(lesson_id, module_id);
    }
  }, [lesson_id, module_id]);

  useEffect(() => {
    if (
      moduleStore.status === "Loaded" &&
      moduleStore.module[0] &&
      moduleStore.module[0].file
    ) {
      setLoadingMarkdown(true);
      getMarkdownFromUrl(moduleStore.module[0].file[0].url);
    }
  }, [moduleStore.status, moduleStore.module]);

  useEffect(() => {
    console.log(lessonContext.lesson);
  }, [lessonContext.lesson]);

  useEffect(() => {
    console.log(moduleStore.module);
  }, [moduleStore.module]);

  const getMarkdownFromUrl = async (url: string) => {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const text = response.data;
    setMarkdown(text);
    setLoadingMarkdown(false);
    return text;
  };

  const markModuleAsComplete = async () => {
    const session = await authClient.getSession();
    if (!session || !session.data) {
      console.error("No session found");
      return;
    }

    await moduleStore.markModuleFinished({
      lessonId: lesson_id,
      moduleId: moduleStore.module[0].id,
      userId: session.data.user.id,
    });

    setShowCongrats(true);
  };

  // Show loading skeleton while markdown is loading, even after initial data load
  if (
    lessonContext.status === "loading" ||
    moduleStore.status === "Loading" ||
    !lessonContext.lesson ||
    loadingMarkdown // <-- add this condition
  ) {
    return (
      <main className="w-full min-h-[60vh] bg-muted py-8">
        <article className="max-w-3xl mx-auto px-4">
          <Skeleton className="h-10 w-2/3 mb-6" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-5/6 mb-3" />
          <Skeleton className="h-6 w-2/3 mb-3" />
          <Skeleton className="h-6 w-1/2 mb-3" />
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-6 w-2/3 mb-3" />
          <Skeleton className="h-6 w-1/2 mb-3" />
          <Skeleton className="h-10 w-40 mt-10" />
        </article>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[80vh] bg-muted py-10">
      <article className="max-w-3xl mx-auto px-4">
        <ChevronLeft className="my-4" onClick={() => router.back()} />
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkParse, remarkBaybayin]}
            
          >
            {markdown}
          </ReactMarkdown>
        </div>
        <div className="mt-12">
          <Button
            ref={buttonElement}
            onClick={markModuleAsComplete}
            variant="default"
            size="lg"
            className="relative overflow-hidden"
          >
            Complete Module
          </Button>
        </div>
        <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Congratulations!</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              You have completed this module. Great job!
            </div>
            <DialogFooter>
              <Button onClick={() => setShowCongrats(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </article>
    </main>
  );
}
