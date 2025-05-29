
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Uttar Pradesh",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Thanks to this platform, I was able to discover and apply for the PM-KISAN scheme. The process was so simple, and I received my first installment within weeks. This has been a great support for my farming activities.",
    scheme: "PM-KISAN"
  },
  {
    id: 2,
    name: "Sunita Devi",
    location: "Bihar",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "I had been trying to get health insurance for my family for years but didn't know where to start. Through this platform, I found out about Ayushman Bharat and got my family covered. The step-by-step guidance was incredibly helpful.",
    scheme: "Ayushman Bharat"
  },
  {
    id: 3,
    name: "Mohammad Farhan",
    location: "Tamil Nadu",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "As a small business owner, I was struggling to find the right schemes for my business. This platform helped me discover MUDRA loans and guided me through the application. Now my business is growing steadily.",
    scheme: "MUDRA Loan"
  },
  {
    id: 4,
    name: "Ananya Sharma",
    location: "Rajasthan",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    text: "The Ujjwala Yojana changed my life, and I found it through this platform. Now I cook with LPG instead of firewood, which has improved my health and saved me time. The application process was straightforward.",
    scheme: "PM Ujjwala Yojana"
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from citizens who have successfully accessed government schemes through our platform.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:shrink-0 md:w-1/3 bg-gradient-to-br from-scheme-primary to-scheme-accent p-8 flex flex-col justify-center items-center text-white">
              <Avatar className="w-24 h-24 border-4 border-white mb-4">
                <AvatarImage src={currentTestimonial.avatar} alt={currentTestimonial.name} />
                <AvatarFallback>{currentTestimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-xl">{currentTestimonial.name}</h3>
                <p className="text-white/80">{currentTestimonial.location}</p>
                <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-sm inline-block">
                  {currentTestimonial.scheme}
                </div>
              </div>
            </div>
            
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
              <Quote size={40} className="text-gray-200 mb-4" />
              <p className="text-gray-600 italic mb-6 text-lg">
                "{currentTestimonial.text}"
              </p>
              
              <div className="flex justify-between items-center mt-auto">
                <p className="text-sm text-gray-500">
                  {currentIndex + 1} of {testimonials.length} testimonials
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
