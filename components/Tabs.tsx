"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

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
  const [xNews, setXNews] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [xSummary, setXSummary] = useState<string>("");
  const [xSummaryLoading, setXSummaryLoading] = useState(false);
  const [xSummaryError, setXSummaryError] = useState("");
  const [traditionalNews, setTraditionalNews] = useState<any[] | null>(null);
  const [traditionalLoading, setTraditionalLoading] = useState(false);
  const [traditionalError, setTraditionalError] = useState("");
  const [xPage, setXPage] = useState(1);
  const [traditionalPage, setTraditionalPage] = useState(1);
  const [hasMoreX, setHasMoreX] = useState(true);
  const [hasMoreTraditional, setHasMoreTraditional] = useState(true);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = React.useCallback(() => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage >= 0.9) {
      if (activeTab === 'x-news' && !loading && hasMoreX) {
        loadMoreXNews();
      } else if (activeTab === 'traditional-media' && !traditionalLoading && hasMoreTraditional) {
        loadMoreTraditionalNews();
      }
    }
  }, [activeTab, loading, traditionalLoading, hasMoreX, hasMoreTraditional]);

  React.useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const loadMoreXNews = async () => {
    if (loading || !hasMoreX) return;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/twitter?page=${xPage + 1}`);
      const newData = Array.isArray(response.data) ? response.data : [];
      if (newData.length === 0) {
        setHasMoreX(false);
      } else {
        setXNews(prev => [...(prev || []), ...newData]);
        setXPage(prev => prev + 1);
      }
    } catch (e) {
      console.error('Error loading more X news:', e);
    }
    setLoading(false);
  };

  const loadMoreTraditionalNews = async () => {
    if (traditionalLoading || !hasMoreTraditional) return;
    setTraditionalLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/?page=${traditionalPage + 1}`);
      const newData = Array.isArray(response.data) ? response.data : [];
      if (newData.length === 0) {
        setHasMoreTraditional(false);
      } else {
        setTraditionalNews(prev => [...(prev || []), ...newData]);
        setTraditionalPage(prev => prev + 1);
      }
    } catch (e) {
      console.error('Error loading more traditional news:', e);
    }
    setTraditionalLoading(false);
  };

  React.useEffect(() => {
    async function fetchXNews() {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/twitter?page=1`);
        const data = Array.isArray(response.data) ? response.data : [];
        setXNews(data);
        setHasMoreX(data.length > 0);
      } catch (e) {
        setXNews([]);
        setHasMoreX(false);
      }
      setLoading(false);
    }
    fetchXNews();
  }, []);

  // Add back the X summary effect
  React.useEffect(() => {
    if (showSummary && activeTab === 'x-news') {
      setXSummaryLoading(true);
      setXSummaryError("");
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/twitter/summary?hour=${summaryRange}`)
        .then(res => {
          setXSummary(
            typeof res.data === 'string'
              ? res.data
              : res.data?.parts?.[0]?.text || ""
          );
        })
        .catch(() => {
          setXSummaryError("Failed to load summary.");
        })
        .finally(() => {
          setXSummaryLoading(false);
        });
    }
  }, [showSummary, activeTab, summaryRange]);

  React.useEffect(() => {
    if (activeTab === 'traditional-media') {
      setTraditionalLoading(true);
      setTraditionalError("");
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news/?page=1`)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [];
          setTraditionalNews(data);
          setHasMoreTraditional(data.length > 0);
        })
        .catch(() => {
          setTraditionalError("Failed to load traditional media news.");
          setTraditionalNews([]);
          setHasMoreTraditional(false);
        })
        .finally(() => {
          setTraditionalLoading(false);
        });
    }
  }, [activeTab]);

  // Tab content sources
  const feeds: Record<TabId, any[]> = {
    'x-news': xNews || [],
    'traditional-media': traditionalNews || [],
  };

  const currentTab = tabKeys.find(t => t.id === activeTab);
  const feedData = feeds[activeTab];
  const summaryData = dummySummaries[(currentTab?.summaryKey || 'x') as SummaryKey][summaryRange];

  return (
    <div className={cn("w-full max-w-3xl h-[90vh] flex flex-col gap-y-2", className)}>
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
      <div 
        ref={contentRef}
        className="relative items-center h-screen overflow-y-auto p-4 bg-white text-black rounded-xl border border-gray-200 min-h-60 h-full flex flex-col justify-between" 
        style={{ minHeight: 320 }}
      >
        {/* Floating AI button */}
        {!showSummary && (
          <button
            className={cn("px-4  fixed md:bottom-8 bottom-16 z-50 py-2 gap-4 mb-4 flex flex-row items-center justify-center bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all", activeTab === 'x-news' ? "flex" : "hidden")}
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
          loading && activeTab === 'x-news' ? (
            <div className="flex items-center justify-center h-full">Loading X news...</div>
          ) : traditionalLoading && activeTab === 'traditional-media' ? (
            <div className="flex items-center justify-center h-full">Loading traditional media news...</div>
          ) : (
            <div className="flex h-full flex-col gap-4">
              {Array.isArray(feedData) && feedData.length > 0 ? (
                <>
                  {feedData.map((item: any, index: number) => (
                    <div key={index} className="flex md:flex-row flex-col gap-4 bg-gray-100 rounded-lg p-3 shadow-sm">
                      <img src={
                        activeTab === 'x-news'
                          ? item.profile_image_url || "/x.avif"
                          : "/news1.svg"
                        } alt={item.authorName || item.title} className={cn("w-full md:w-24 md:h-full h-24 object-cover rounded-md", activeTab === 'x-news' ? "flex" : "hidden")} />
                      <div className="flex flex-col justify-center w-full">
                        <span className="text-gray-700 flex flex-row items-center justify-between text-sm">
                          <h3 className="text-lg font-semibold w-[80%] mb-1"> {activeTab === 'x-news' ? item.displayName : item.title}</h3>
                          <p className="text-gray-700 text-sm">{item.createdAt ? item.createdAt.split('T')[0] : 'No date'}</p>
                        </span>
                        <p className="text-gray-700 text-sm">{
                          activeTab === 'x-news'
                            ? (item.text && item.text.length > 50 ? item.text.slice(0, 250) + '...' : item.text)
                            : (item.summary && item.summary.length > 50 ? item.summary.slice(0, 900) + '...' : item.summary)
                        }</p>
                        {activeTab === 'traditional-media' && item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mt-1">Read more</a>
                        )}
                      </div>
                    </div>
                  ))}
                  {(loading || traditionalLoading) && (
                    <div className="text-center py-4">
                      Loading more...
                    </div>
                  )}
                </>
              ) : Array.isArray(feedData) && feedData.length === 0 ? (
                <div className="text-red-500">No feed data found.</div>
              ) : null}
              {traditionalError && activeTab === 'traditional-media' && (
                <div className="text-red-500">{traditionalError}</div>
              )}
            </div>
          )
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
            <div className="bg-gray-100 rounded-lg p-4 w-full text-center text-base shadow-sm min-h-20 flex items-center justify-center">
              {activeTab === 'x-news' ? (
                xSummaryLoading ? (
                  <span>Loading summary...</span>
                ) : xSummaryError ? (
                  <span className="text-red-500">{xSummaryError}</span>
                ) : (
                  <span>
                    {(() => {
                      // Try to parse bullet points in the summary
                      const bulletRegex = /\* \*\*(.+?):\*\* ([^*]+)(?=(\* \*\*|$))/g;
                      const matches = [...(xSummary.matchAll(bulletRegex))];
                      if (matches.length > 0) {
                        return (
                          <ul className="text-left w-full">
                            {matches.map((m, i) => (
                              <li key={i} className="mb-2">
                                <span className="font-bold">• {m[1]}</span>
                                <div className="ml-4 text-sm text-gray-700">{m[2]}</div>
                              </li>
                            ))}
                          </ul>
                        );
                      } else {
                        return xSummary;
                      }
                    })()}
                  </span>
                )
              ) : (
                summaryData
              )}
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
