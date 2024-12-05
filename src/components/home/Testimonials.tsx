import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Kavitha Patel",
    role: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1706943262117-b35de4ba50b4?q=80&w=2304&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "SubscriptEase has transformed how I manage my business subscriptions. The insights have helped me save over $200 monthly!",
    rating: 5
  },
  {
    name: "Peter Williams",
    role: "Tech Professional",
    image: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "The dashboard is intuitive and the analytics are incredibly detailed. It's exactly what I needed to keep track of my subscriptions.",
    rating: 5
  },
  {
    name: "Mamta Singh",
    role: "Content Creator",
    image: "https://plus.unsplash.com/premium_photo-1682089810582-f7b200217b67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "Finally, a tool that helps me manage all my creative software subscriptions in one place. The reminder system is a lifesaver!",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#121212] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#EAEAEA] mb-4">
            Loved by Thousands
          </h2>
          <p className="text-[#C0C0C0] max-w-2xl mx-auto">
            Join our community of satisfied users who've taken control of their subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-[#1A1A1A] p-6 rounded-xl"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-[#C5A900] fill-current" />
                ))}
              </div>
              <p className="text-[#C0C0C0] mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <div className="text-[#EAEAEA] font-semibold">{testimonial.name}</div>
                  <div className="text-[#C0C0C0] text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}