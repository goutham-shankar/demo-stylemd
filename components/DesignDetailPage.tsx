"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Download, Monitor, Code2, Check } from "lucide-react";
import type { DesignCard } from "@/lib/design-cards";
import type { RunData } from "@/lib/api-types";
import { FetchedRunDesignDetail } from "@/components/FetchedRunDesignDetail";
import { WebsitePreview } from "@/components/WebsitePreview";
import { CatalogMainSections } from "@/components/CatalogMainSections";

export type DesignDetailPageProps =
  | { card: DesignCard; run?: never }
  | {
      run: RunData;
      card?: never;
      isGenerating: boolean;
      onBack: () => void;
      onRunAgain?: () => void;
      isRunBusy?: boolean;
    };

export default function DesignDetailPage(props: DesignDetailPageProps) {
  if ("card" in props) {
    return <CatalogDesignDetailPage card={props.card} />;
  }
  return (
    <FetchedRunDesignDetail
      run={props.run}
      isGenerating={props.isGenerating}
      onBack={props.onBack}
      onRunAgain={props.onRunAgain}
      isRunBusy={props.isRunBusy}
    />
  );
}

type CatalogProps = {
  card: DesignCard;
};

function CatalogDesignDetailPage({ card }: CatalogProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const generateMarkdown = () =>
    `# ${card.name} Design System\n\n## Overview\n${card.desc}\n\n## Colors\n${card.palette
      .map((p, i) => `- **D${i + 1} ${p.name}**: ${p.hex}`)
      .join("\n")}\n\n## Typography\n${card.fonts
      .map((f) => `- **${f.name}**: ${f.role}`)
      .join("\n")}\n\n## Buttons\n- Primary: ${card.accentColor}\n- Secondary: border-gray-300\n\n## Spacing\n- Base rhythm: 4px\n- Gap: 8px\n- Section: 32px\n`;

  const handleCopy = async () => {
    const content = generateMarkdown();
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = content;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.id}-design.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/styles");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-medium bg-[#F6F8FA] px-6 py-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 rounded-lg bg-gray-900 border border-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer transition-colors duration-150"
          type="button"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-medium bg-surface px-4 py-1.5 text-sm font-medium text-primary hover:bg-surface-soft cursor-pointer transition-colors duration-150"
            type="button"
          >
            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy DESIGN.md"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-gray-900 border border-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 cursor-pointer transition-colors duration-150"
            type="button"
          >
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      {/* Body — exact 50/50 split */}
      <div className="grid flex-1 md:grid-cols-[40%_60%]">
        {/* Left sidebar — 50% */}
        <div className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r border-medium md:block">
          <WebsitePreview card={card} />
        </div>

        {/* Right content — 50% */}
        <div className="overflow-y-auto px-8 py-7 pb-24">
          {/* Brand header */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-[60px] w-[60px] items-center justify-center rounded-[7.2px] text-lg font-black text-white"
                style={{ background: card.accentColor }}
              >
                {typeof card.logo === "string" && card.logo.startsWith("/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.logo} alt={card.name} className="w-9 h-9 object-contain" />
                ) : (
                  card.logo
                )}
              </div>
               <h1 className="heading-h2 tracking-tight">
                 {card.name}
               </h1>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-[16px] border px-3 py-1 text-xs font-medium"
                  style={{
                    borderColor: `${card.accentColor}55`,
                    color: card.accentColor,
                    backgroundColor: `${card.accentColor}14`,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-secondary">
              {card.desc}
            </p>

            <div className="inline-flex gap-0 rounded-[12px] border border-medium bg-surface-soft p-1 h-[48px] items-center">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "preview"
                    ? "bg-accent-blue text-white shadow-md"
                    : "text-secondary hover:text-primary"
                }`}
                type="button"
              >
                <Monitor size={14} /> Live Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "code"
                    ? "bg-accent-blue text-white shadow-md"
                    : "text-secondary hover:text-primary"
                }`}
                type="button"
              >
                <Code2 size={14} /> DESIGN.md
              </button>
            </div>
          </div>

          {activeTab === "preview" ? (
            <CatalogMainSections card={card} extras={null} />
          ) : (
            <section className="rounded-2xl border border-light bg-surface p-6">
              <h2 className="mb-4 text-base font-bold text-primary">DESIGN.md</h2>
              <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs text-gray-100">
                <code>{`# ${card.name} Design System\n\n## Overview\n${card.desc}\n\n## Colors\n${card.palette.map((p, i) => `- **D${i + 1} ${p.name}**: ${p.hex}`).join("\n")}\n\n## Typography\n${card.fonts.map((f) => `- **${f.name}**: ${f.role}`).join("\n")}\n\n## Buttons\n- Primary: ${card.accentColor}\n- Secondary: border-gray-300\n\n## Spacing\n- Base rhythm: 4px\n- Gap: 8px\n- Section: 32px\n`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}