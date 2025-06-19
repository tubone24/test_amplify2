'use client';

import { AssistantUI } from "@/components/assistant-ui";
import { Navigation } from "@/components/Navigation";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <AssistantUI />
      </div>
    </div>
  );
}