import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are accommodations on Habitux really 100% zero brokerage?',
      a: 'Yes, absolutely. Habitux is founded on the principle that students should never pay middleman commission or brokerage fees to find safe housing. You browse, compare, and connect directly with hostel owners and property managers without any fee deducted from you.',
    },
    {
      q: 'How does Habitux verify properties before they appear on the platform?',
      a: 'Every property submitted by an owner undergoes administrative audit. Our team verifies the physical address, photos of bedrooms and washrooms, food hygiene standards, fire safety & security measures, and ensures transparent written rent and deposit terms.',
    },
    {
      q: 'How is my security deposit protected?',
      a: 'Hostel listings on Habitux specify exact security deposit terms, notice period requirements (typically 15 to 30 days), and electricity billing policies upfront. You receive an official written rent receipt and deposit acknowledgement upon booking.',
    },
    {
      q: 'Can parents visit or stay with students at the hostel?',
      a: 'Most student hostels have dedicated parent guest lounges. Depending on the hostel policy, parents may stay overnight in designated parent guest rooms upon advance notice to the warden. You can view each property\'s visitor policy on its details page.',
    },
    {
      q: 'What meal plans are provided, and can meals be customized?',
      a: 'Most verified hostels provide 3 to 4 meals daily (breakfast, lunch, evening tea/snacks, and dinner). Many campuses offer student tiffin packaging for college hours. Vegetarian and non-vegetarian options, as well as special Jain or allergy preferences, are explicitly listed in the meal details.',
    },
    {
      q: 'How do I schedule a physical room visit before paying anything?',
      a: 'Simply click "Schedule Visit" or "Enquire" on any hostel card. Choose your preferred visit date and move-in time. The owner receives your request directly and contacts you via phone or WhatsApp to coordinate your on-site walkthrough.',
    },
  ];

  return (
    <section id="faq-section" className="py-16 sm:py-24 bg-white border-b border-[#EDE8DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF4B26]" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading">
            Got Questions? We&apos;ve Got Answers.
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know about discovering, visiting, and booking student hostels on Habitux.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#EDE8DF] rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left bg-white hover:bg-[#FAF8F5] flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-base sm:text-lg text-[#0F172A] font-heading">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#FF4B26] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
