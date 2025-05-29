
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Scheme Access India?",
      answer:
        "Scheme Access India is a unified platform that helps Indian citizens discover, understand, and apply for government schemes and services. It aims to simplify the process of finding and accessing benefits from various government programs."
    },
    {
      question: "How do I create a profile?",
      answer:
        "Click on the 'Register' button in the top right corner of the page. Fill in your details in the registration form, verify your email or mobile number, and complete your profile by providing additional information for personalized recommendations."
    },
    {
      question: "How are scheme recommendations generated?",
      answer:
        "Our system analyzes your profile information (age, income, location, occupation, etc.) and matches it with the eligibility criteria of various schemes. The more complete your profile, the more accurate our recommendations will be."
    },
    {
      question: "Can I apply for schemes directly through this platform?",
      answer:
        "Yes, for many schemes you can apply directly through our platform using our guided application process. For some schemes, we'll redirect you to the official government portal with instructions on how to proceed."
    },
    {
      question: "Is my data secure on this platform?",
      answer:
        "Yes, we follow strict security protocols to protect your personal information. Your data is encrypted and only used for the purpose of providing you with relevant scheme information and processing your applications with your consent."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about using our platform and accessing government schemes.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-center mt-10 p-6 bg-gray-50 rounded-lg max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you with any questions you might have.
          </p>
          <div className="flex justify-center gap-4">
            <a href="mailto:support@schemeaccess.gov.in" className="text-scheme-primary hover:underline">
              Email Support
            </a>
            <span className="text-gray-400">|</span>
            <a href="tel:18001234567" className="text-scheme-primary hover:underline">
              Call Helpline
            </a>
            <span className="text-gray-400">|</span>
            <a href="/faq" className="text-scheme-primary hover:underline">
              Visit Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
