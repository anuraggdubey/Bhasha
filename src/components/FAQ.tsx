'use client';

import React, { useState } from 'react';
import Mascot from './Mascot';

const faqs = [
  {
    question: "What platforms is Bhasha available on?",
    answer: "Bhasha is currently available as a web platform that seamlessly works across your macOS and Windows browsers."
  },
  {
    question: "How many languages does Bhasha support?",
    answer: "Bhasha's Team Relay currently supports 18 global locales including Hindi, Japanese, German, and Spanish with zero translation drift."
  },
  {
    question: "How is Bhasha different from standard translators?",
    answer: "Unlike standard translators, Bhasha locks factual invariants (like deadlines and assignees) to ensure translations adapt grammar without mutating the core commitments."
  },
  {
    question: "Can I speak in Hinglish?",
    answer: "Absolutely! Bhasha perfectly understands mixed-language speech, capturing true intent and transcribing without hesitation."
  },
  {
    question: "How is my data handled?",
    answer: "Bhasha processes your voice notes securely. Fact invariants are strictly protected, ensuring complete privacy and zero drift."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
        {/* Left Column: Heading & Mascot */}
        <div className="flex flex-col justify-between h-full relative">
          <div>
            <h2 className="text-4xl sm:text-5xl tracking-tight text-[#252522] mb-4 font-sans font-medium">
              Frequently asked questions
            </h2>
            <p className="text-[#6B6B65] text-lg font-sans mb-8">
              Have questions? We'd love to hear from you.
            </p>
            <a 
              href="/contact-sales" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#252522] hover:bg-[#3A3A34] text-white transition-all shadow-sm w-max"
            >
              Contact Us
            </a>
          </div>
          
          {/* Mascot Animation positioned at the bottom right of the left column */}
          <div className="hidden lg:block absolute bottom-0 right-10">
            <Mascot color="blue-reading" size={160} />
          </div>
        </div>

        {/* Right Column: Chat Bubbles */}
        <div className="flex flex-col gap-4 relative">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="flex flex-col items-start w-full">
                {/* Question Bubble */}
                <button
                  type="button"
                  onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                  className="bg-white border border-black/[0.04] shadow-sm rounded-2xl rounded-tl-sm px-6 py-4 text-left text-[15px] text-[#252522] hover:bg-[#F7F7F2] transition-colors w-max max-w-[90%] cursor-pointer"
                >
                  {faq.question}
                </button>
                
                {/* Answer Bubble (Animated) */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out pl-8 sm:pl-16 w-full flex justify-end ${
                    isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                  }`}
                >
                  <div className="bg-[#252522] text-white rounded-2xl rounded-tr-sm px-6 py-4 text-[15px] leading-relaxed shadow-md w-max max-w-[90%] md:max-w-[80%]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
