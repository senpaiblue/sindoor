"use client";

import React, { useState } from "react";
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

// Dummy summary data
const dummySummaries = {
  x: {
    '1hr': 'Summary of X news for the last 1 hour: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '6hr': 'Summary of X news for the last 6 hours: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    '12hr': 'Summary of X news for the last 12 hours: Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    '24hr': 'Summary of X news for the last 24 hours: Duis aute irure dolor in reprehenderit in voluptate velit esse.',
  },
  traditional: {
    '1hr': 'Summary of Traditional Media for the last 1 hour: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '6hr': 'Summary of Traditional Media for the last 6 hours: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    '12hr': 'Summary of Traditional Media for the last 12 hours: Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    '24hr': 'Summary of Traditional Media for the last 24 hours: Duis aute irure dolor in reprehenderit in voluptate velit esse.',
  }
};

const tabKeys = [
  { id: 'x-news', label: 'Verified X news', summaryKey: 'x' },
  { id: 'traditional-media', label: 'Traditional media', summaryKey: 'traditional' }
] as const;

type TabId = typeof tabKeys[number]['id'];
type SummaryKey = typeof tabKeys[number]['summaryKey'];

const AnimatedTabs = ({
  tabs,
  defaultTab,
  className,
}: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab as TabId || tabKeys[0].id);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryRange, setSummaryRange] = useState<'1hr'|'6hr'|'12hr'|'24hr'>('1hr');

  // Tab content sources
  const feeds: Record<TabId, any[]> = {
    'x-news': xPlatformNews,
    'traditional-media': originalArticles,
  };

  const currentTab = tabKeys.find(t => t.id === activeTab);
  const feedData = feeds[activeTab];
  const summaryData = dummySummaries[(currentTab?.summaryKey || 'x') as SummaryKey][summaryRange];

  return (
    <div className={cn("w-full max-w-lg flex flex-col gap-y-2", className)}>
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-1 rounded-xl border border-gray-200 sticky top-0 z-30">
        {tabKeys.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowSummary(false); }}
            className={cn(
              "relative px-4 py-2 text-base font-medium rounded-lg transition-colors flex-1",
              activeTab === tab.id ? "bg-black text-white" : "bg-white text-black border border-gray-200"
            )}
            style={{ minWidth: 0 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="relative h-screen overflow-y-auto p-4 bg-white text-black rounded-xl border border-gray-200 min-h-60 h-full flex flex-col justify-between" style={{ minHeight: 320 }}>
        {/* Floating AI button */}
        {!showSummary && (
          <button
            className="px-4 py-2 gap-4 mb-4 flex flex-row items-center justify-center bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all z-40"
            onClick={() => setShowSummary(true)}
            aria-label="Show AI summary"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
          >
            <img src="/ai.svg" alt="AI" className="w-5 h-5" />
            <p className="text-white text-lg font-bold">
              {currentTab?.id === 'x-news' ? 'X Summary' : 'Traditional Media Summary'}
            </p>
          </button>
        )}
        {/* Feed or Summary */}
        {!showSummary ? (
          <div className="flex flex-col gap-4">
            {feedData.map((item: any) => (
              <div key={item.id} className="flex gap-4 bg-gray-100 rounded-lg p-3 shadow-sm">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-700 text-sm">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Time range buttons */}
            <div className="flex gap-2 mb-2">
              {['1hr','6hr','12hr','24hr'].map((range) => (
                <button
                  key={range}
                  className={cn(
                    "px-3 py-1 rounded-full border text-sm font-medium transition-all",
                    summaryRange === range ? "bg-black text-white border-black" : "bg-white text-black border-gray-300"
                  )}
                  onClick={() => setSummaryRange(range as any)}
                >
                  {range}
                </button>
              ))}
            </div>
            <div className="bg-gray-100 rounded-lg p-4 w-full text-center text-base shadow-sm">
              {summaryData}
            </div>
            <button
              className="mt-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
              onClick={() => setShowSummary(false)}
            >
              Back to feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { AnimatedTabs };
