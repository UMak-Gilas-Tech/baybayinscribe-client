import { HeartPulse, ListIcon } from "lucide-react";
import { SystemHealthCard } from "./SystemHealthCard";
import { SystemLogsCard } from "./SystemLogsCard";
import { systemHealthData, systemLogsData } from "../data/dashboard-data";

interface SystemSectionProps {
  systemHealth: typeof systemHealthData;
  systemLogs: typeof systemLogsData;
}

export function SystemSection({
  systemHealth,
  systemLogs,
}: SystemSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <article>
        <header className="flex xl:flex-row gap-2 items-center mb-2">
          <figure className="p-1 bg-blue-700/30 rounded-xl inline-flex justify-start items-center">
            <HeartPulse strokeWidth={1.5} className="w-9 h-9" />
          </figure>
          <h2 className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left">
            System Health
          </h2>
        </header>
        <SystemHealthCard systemHealth={systemHealth} />
      </article>

      <article>
        <header className="flex xl:flex-row gap-2 items-center">
          <figure className="p-1 bg-blue-700/30 rounded-xl inline-flex justify-start items-center">
            <ListIcon strokeWidth={1.5} className="w-9 h-9" />
          </figure>
          <h2 className="text-blue-950 text-2xl font-semibold font-sans leading-loose text-left">
            System-Generated Logs
          </h2>
        </header>
        <SystemLogsCard logs={systemLogs} />
      </article>
    </section>
  );
}
