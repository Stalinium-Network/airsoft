import { Metadata } from 'next';
import FAQAccordion from '@/components/faq/FAQAccordion';
import AIAssistant from '@/components/faq/AIAssistant';
import { serverApi, FAQ } from '@/utils/api-server';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Zone 37',
  description: 'Find answers to common questions about our STALKER-themed airsoft events, equipment, registration, and more.',
};

export default async function FAQPage() {
  // Fetch FAQs from the server
  const faqs: FAQ[] = await serverApi.getFaqs();

  const faqItems = faqs.length > 0 ? faqs : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Frequently Asked <span className="text-green-500">Questions</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Find answers to common questions about our STALKER-themed airsoft events. 
            Still have questions? Our AI assistant can help.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <FAQAccordion items={faqItems} />
        </div>

        {/* AI Assistant */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI assistant is trained to answer specific questions about our events, equipment, 
              and STALKER lore. Feel free to ask anything!
            </p>
          </div>
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}
