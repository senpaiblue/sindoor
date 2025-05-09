"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import xPlatformNews from "./xPlatformNews.json";
import originalArticles from "./originalArticles.json";

interface Tab {
id: string;
label: string;
content: React.ReactNode;
}

interface AnimatedTabsProps {
tabs?: Tab[];
defaultTab?: string;
className?: string;
}



const newsTabs: Tab[] = [
  {
    id: "x-news",
    label: "X Platform News",
    content: (
      <div className="flex flex-col gap-4">
        {xPlatformNews.map((news) => (
          <div key={news.id} className="flex gap-4 bg-[#222] rounded-lg p-3 shadow">
            <img src={news.image} alt={news.title} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-white mb-1">{news.title}</h3>
              <p className="text-gray-300 text-sm">{news.summary}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "original-articles",
    label: "Original Articles",
    content: (
      <div className="flex flex-col gap-4">
        {originalArticles.map((article) => (
          <div key={article.id} className="flex gap-4 bg-[#222] rounded-lg p-3 shadow">
            <img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-white mb-1">{article.title}</h3>
              <p className="text-gray-300 text-sm">{article.summary}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const AnimatedTabs = ({
tabs = newsTabs,
defaultTab,
className,
}: AnimatedTabsProps) => {
const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);

if (!tabs?.length) return null;

return (
  <div className={cn("w-full max-w-lg flex flex-col gap-y-1", className)}>
    <div className="flex gap-2 flex-wrap bg-[#11111198] bg-opacity-50 backdrop-blur-sm p-1 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative px-3 py-1.5 text-sm font-medium rounded-lg text-white outline-none transition-colors"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-[#111111d1] bg-opacity-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm !rounded-lg"
              transition={{ type: "spring", duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>

    <div className="p-4 bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] text-white bg-opacity-50 backdrop-blur-sm rounded-xl border min-h-60 h-full">
      {tabs.map(
        (tab) =>
          activeTab === tab.id && (
            <motion.div
              key={tab.id}
              initial={{
                opacity: 0,
                scale: 0.95,
                x: -10,
                filter: "blur(10px)",
              }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
              transition={{
                duration: 0.5,
                ease: "circInOut",
                type: "spring",
              }}
            >
              {tab.content}
            </motion.div>
          )
      )}
    </div>
  </div>
);
};

export { AnimatedTabs };
