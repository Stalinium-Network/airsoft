import { Metadata } from 'next';
import FAQAccordion from '@/components/faq/FAQAccordion';
import AIAssistant from '@/components/faq/AIAssistant';
import { serverApi, FAQ } from '@/utils/api-server';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | WW Zov',
  description: 'Find answers to common questions about our STALKER-themed airsoft events, equipment, registration, and more.',
};

export default async function FAQPage() {
  // Fetch FAQs from the server
  const faqs: FAQ[] = await serverApi.getFaqs();

  // Fallback FAQs in case the server request fails or returns empty
  const fallbackFaqs = [
    {
      _id: "fallback1",
      question: "What is STALKER-themed airsoft?",
      answer: "STALKER-themed airsoft combines traditional airsoft gameplay with elements from the S.T.A.L.K.E.R. game series. It creates an immersive post-apocalyptic experience where players navigate the 'Zone,' collect artifacts, complete missions, and engage with the rich lore of the game universe."
    },
    {
      _id: "fallback2",
      question: "What equipment do I need to participate?",
      answer: "Basic requirements include an airsoft replica, eye protection (goggles or full-face mask), appropriate outdoor clothing, and comfortable boots. For STALKER-themed events, we recommend adding post-apocalyptic costume elements, a gas mask (decorative or functional), and a backpack for carrying supplies."
    },
    {
      _id: "fallback3",
      question: "Are beginners welcome?",
      answer: "Absolutely! We welcome players of all experience levels. Beginners can rent equipment from us and will receive a safety briefing before the game. We also assign new players to experienced teams who can provide guidance during the event."
    }
  ];

  // Use server data if available, otherwise use fallback data
  const faqItems = faqs.length > 0 ? faqs : fallbackFaqs;

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
