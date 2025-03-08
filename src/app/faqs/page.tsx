import { Metadata } from 'next';
import FAQAccordion from '@/components/faq/FAQAccordion';
import AIAssistant from '@/components/faq/AIAssistant';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | WW Zov',
  description: 'Find answers to common questions about our STALKER-themed airsoft events, equipment, registration, and more.',
};

// FAQ data
const faqItems = [
  {
    question: "What is STALKER-themed airsoft?",
    answer: "STALKER-themed airsoft combines traditional airsoft gameplay with elements from the S.T.A.L.K.E.R. game series. It creates an immersive post-apocalyptic experience where players navigate the 'Zone,' collect artifacts, complete missions, and engage with the rich lore of the game universe."
  },
  {
    question: "What equipment do I need to participate?",
    answer: "Basic requirements include an airsoft replica, eye protection (goggles or full-face mask), appropriate outdoor clothing, and comfortable boots. For STALKER-themed events, we recommend adding post-apocalyptic costume elements, a gas mask (decorative or functional), and a backpack for carrying supplies."
  },
  {
    question: "Are beginners welcome?",
    answer: "Absolutely! We welcome players of all experience levels. Beginners can rent equipment from us and will receive a safety briefing before the game. We also assign new players to experienced teams who can provide guidance during the event."
  },
  {
    question: "What safety measures are in place?",
    answer: "Safety is our top priority. All participants must wear appropriate eye protection at all times in game areas. We conduct mandatory safety briefings, enforce strict FPS limits on all replicas, and have trained staff monitoring gameplay. Medical personnel are always on-site during events."
  },
  {
    question: "How do I register for an event?",
    answer: "Registration is available through our website. Navigate to the Events section, select the event you're interested in, and follow the registration instructions. Payment can be made online, and you'll receive a confirmation email with all necessary details."
  },
  {
    question: "Can I create my own faction or join an existing one?",
    answer: "Yes! Players can join established factions like Duty, Freedom, or Loners, or create their own with enough members. Each faction has unique objectives and starting equipment. Contact us before the event if you're interested in creating a new faction."
  },
  {
    question: "What makes your events different from regular airsoft games?",
    answer: "Our events focus heavily on immersion and storytelling. Beyond combat, players engage with NPCs, solve puzzles, trade artifacts, and navigate environmental hazards. The game world evolves based on player actions, creating a dynamic experience that changes with each event."
  }
];

export default function FAQPage() {
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
