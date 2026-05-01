"use client";

import { motion } from "framer-motion";
import {
  Search,
  CloudSun,
  MapPin,
  Route,
  HelpCircle,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ToolPartInfo {
  toolName: string;
  state: string;
  input: Record<string, unknown>;
}

interface ToolInvocationDisplayProps {
  toolParts: ToolPartInfo[];
}

const TOOL_CONFIG: Record<
  string,
  { icon: React.ElementType; label: string; color: string; bg: string }
> = {
  searchHeritage: {
    icon: Search,
    label: "문화유산 검색",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  getWeather: {
    icon: CloudSun,
    label: "날씨 조회",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  searchTourSpots: {
    icon: MapPin,
    label: "관광지 탐색",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  planTourCourse: {
    icon: Route,
    label: "코스 생성",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
  generateQuiz: {
    icon: HelpCircle,
    label: "퀴즈 생성",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
};

function formatInput(input: Record<string, unknown>): string {
  const entries = Object.entries(input).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return entries
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join(", ");
}

export default function ToolInvocationDisplay({ toolParts }: ToolInvocationDisplayProps) {
  if (toolParts.length === 0) return null;

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 flex-shrink-0" />
      <div className="space-y-1.5 flex-1 max-w-[80%]">
        {toolParts.map((part, idx) => {
          const config = TOOL_CONFIG[part.toolName] || {
            icon: Search,
            label: part.toolName,
            color: "text-stone-600",
            bg: "bg-stone-50 border-stone-200",
          };
          const Icon = config.icon;
          const isComplete = part.state === "output-available";
          const isError = part.state === "error";
          const inputStr = formatInput(part.input);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.1 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${config.bg}`}
            >
              <Icon size={14} className={config.color} />
              <span className={`font-medium ${config.color}`}>
                {config.label}
              </span>
              {inputStr && (
                <span className="text-stone-400 truncate max-w-[200px]">
                  ({inputStr})
                </span>
              )}
              <span className="ml-auto">
                {isComplete ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : isError ? (
                  <AlertCircle size={14} className="text-red-500" />
                ) : (
                  <Loader2 size={14} className="text-stone-400 animate-spin" />
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
