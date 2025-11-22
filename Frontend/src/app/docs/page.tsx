import Link from "next/link";
import { topics } from "./_data";
import { ArrowLeft, Bot } from "lucide-react";

export default function DocsIndexPage() {
  return (
    <div className="space-y-8">
      {/* Back to Home Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <header>
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/"
            className="font-semibold tracking-tight text-white flex items-center gap-2"
          >
            <Bot className="size-12 cursor-pointer bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] p-2 rounded-xl" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            AgenticWebpilot Documentation
          </h1>
        </div>
        <p className="mt-2 text-white/70">
          Pragmatic, real-world guidance to build, ship, and operate your
          AI-powered web navigation product reliably.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.slice(0, 6).map((t) => (
          <Link
            key={t.slug}
            href={`/docs/${t.slug}`}
            className="block rounded-lg border border-white/10 hover:border-indigo-500/30 bg-white/5 hover:bg-white/[0.07] p-4 transition-colors"
          >
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-white/60">{t.description}</div>
          </Link>
        ))}
      </section>

      <p className="text-white/60 text-sm">
        Use the sidebar to explore all topics.
      </p>
    </div>
  );
}
