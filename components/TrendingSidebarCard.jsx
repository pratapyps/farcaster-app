import React from "react";

function TrendingSidebarCard({ trends }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-4 w-full max-w-sm shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">What's happening</h2>
      {trends.map((section, idx) => (
        <div key={idx} className="mb-4">
          {/* Section Heading: large & bold */}
          <div className="text-gray-300 text-lg font-bold mb-2">{section.label}</div>
          {section.items.map((item, ii) => (
            <div
              key={ii}
              className="py-1 px-2 hover:bg-gray-800 rounded transition cursor-pointer"
            >
              {/* Title ab aur chhota */}
              <div className="text-sm text-white">{item.title}</div>
              {/* Mentions - bahut chhota */}
              <div className="text-[10px] text-gray-500 mt-0.5">{item.count} mentions</div>
              {/* Optional subtitle */}
              {item.subtitle && (
                <div className="text-xs text-gray-500">{item.subtitle}</div>
              )}
            </div>
          ))}
        </div>
      ))}
      <button className="text-blue-400 mt-2 hover:underline">Show more</button>
    </div>
  );
}

export default TrendingSidebarCard;
