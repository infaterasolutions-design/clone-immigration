"use client";

import React, { useState } from 'react';

export default function FAQAccordion({ faqs = [] }) {
  const [openIndexes, setOpenIndexes] = useState(new Set());

  if (!faqs || faqs.length === 0) return null;

  const toggleAccordion = (index) => {
    setOpenIndexes(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Generate JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="my-10 w-full max-w-none">
      <h2 className="text-2xl font-bold font-headline text-slate-900 mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndexes.has(index);
          return (
            <div key={index} className="border-b border-slate-200 last:border-0 overflow-hidden transition-all duration-200">
              <button
                type="button"
                className="w-full py-4 flex items-center justify-between bg-transparent group transition-colors cursor-pointer text-left focus:outline-none"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
              >
                <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-[16px] md:text-lg pr-4">{faq.question}</span>
                <span className="text-indigo-600 font-bold shrink-0 transition-transform duration-300">
                  {isOpen ? (
                    <span className="material-symbols-outlined block">expand_less</span>
                  ) : (
                    <span className="material-symbols-outlined block">expand_more</span>
                  )}
                </span>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div 
                    className="pb-5 pt-2 prose prose-slate max-w-none prose-p:leading-relaxed prose-a:text-indigo-600 hover:prose-a:text-indigo-500"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
