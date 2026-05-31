import React, { useState } from 'react';
import TiptapEditor from './TiptapEditor';

export default function FAQPanel({ faqs, setFaqs }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "", display_order: faqs.length }]);
    setExpandedIndex(faqs.length);
  };

  const updateFAQ = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const removeFAQ = (index) => {
    const updated = faqs.filter((_, i) => i !== index);
    // update display order
    updated.forEach((faq, i) => { faq.display_order = i; });
    setFaqs(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const moveFAQ = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === faqs.length - 1) return;

    const updated = [...faqs];
    const temp = updated[index];
    updated[index] = updated[index + direction];
    updated[index + direction] = temp;

    // update display order
    updated.forEach((faq, i) => { faq.display_order = i; });
    setFaqs(updated);

    if (expandedIndex === index) setExpandedIndex(index + direction);
    else if (expandedIndex === index + direction) setExpandedIndex(index);
  };

  return (
    <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
        <button 
          type="button"
          onClick={addFAQ}
          className="admin-btn admin-btn-primary admin-btn-sm"
        >
          + Add FAQ
        </button>
      </div>
      
      {faqs.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No FAQs added yet. Click "+ Add FAQ" to create an expandable FAQ section.</p>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 bg-slate-100 border-b border-slate-200 cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-slate-400 font-bold text-sm select-none">#{index + 1}</span>
                  <span className="font-medium text-sm text-slate-800 truncate">
                    {faq.question || "New Question..."}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <div className="flex flex-col gap-0.5 mr-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button"
                      onClick={() => moveFAQ(index, -1)}
                      disabled={index === 0}
                      className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-0.5"
                    >
                      <span className="material-symbols-outlined text-[16px] block">expand_less</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => moveFAQ(index, 1)}
                      disabled={index === faqs.length - 1}
                      className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 p-0.5"
                    >
                      <span className="material-symbols-outlined text-[16px] block">expand_more</span>
                    </button>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFAQ(index); }}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Remove FAQ"
                  >
                    <span className="material-symbols-outlined text-[18px] block">delete</span>
                  </button>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="p-4 bg-white flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Question</label>
                    <input 
                      type="text" 
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="e.g. What is the H1B visa?"
                      className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Answer</label>
                    <div className="border border-slate-200 rounded-md">
                      <TiptapEditor 
                        content={faq.answer}
                        onChange={(html) => updateFAQ(index, 'answer', html)}
                        minHeightClass="min-h-[150px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
