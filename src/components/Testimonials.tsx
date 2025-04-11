
const testimonials = [
  {
    quote: "DoKirana has changed how I shop for groceries. I can order from my favorite Kirana store and have everything delivered in no time!",
    name: "Priya Sharma",
    role: "Customer",
    avatar: "/lovable-uploads/a0d0b563-7fb6-4a6d-be40-4bc9358a403c.png"
  },
  {
    quote: "As a working professional, DoKirana saves me precious time while allowing me to support local businesses. It's the best of both worlds.",
    name: "Amit Patel",
    role: "Customer",
    avatar: "/lovable-uploads/a0d0b563-7fb6-4a6d-be40-4bc9358a403c.png"
  },
  {
    quote: "Since joining the DoKirana network, our store has seen a 30% increase in sales. The platform is easy to use and has expanded our customer base.",
    name: "Rajesh Kumar",
    role: "Store Owner",
    avatar: "/lovable-uploads/a0d0b563-7fb6-4a6d-be40-4bc9358a403c.png"
  },
  {
    quote: "DoKirana has transformed our family business. We now serve customers who couldn't visit our store physically, and our revenue has grown significantly.",
    name: "Sunita Gupta",
    role: "Store Owner",
    avatar: "/lovable-uploads/a0d0b563-7fb6-4a6d-be40-4bc9358a403c.png"
  }
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-dokirana-lighter">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">What People Are Saying</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hear from customers and store owners who are part of the DoKirana community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-dokirana-light"
                />
                <div>
                  <p className="italic text-gray-700 mb-4">{testimonial.quote}</p>
                  <div>
                    <h4 className="font-semibold text-dokirana-primary">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
