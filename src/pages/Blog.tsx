
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronRight, Search, Tag, Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How Local Kirana Stores are Adapting to Digital Transformation",
    excerpt: "Discover how neighborhood shops are embracing technology to stay competitive in the digital age.",
    image: "/lovable-uploads/fb48dfd0-69fe-4e9b-b085-d8a0cce0f63f.png",
    author: "Rahul Sharma",
    date: "April 5, 2023",
    category: "Digital Transformation",
    tags: ["Kirana Stores", "Digital Adoption", "Local Business"]
  },
  {
    id: 2,
    title: "5 Benefits of Supporting Your Local Kirana Store",
    excerpt: "Learn why shopping from neighborhood stores strengthens communities and local economies.",
    image: "/lovable-uploads/896ffabb-96c9-4710-b03b-867e60339335.png",
    author: "Priya Patel",
    date: "March 22, 2023",
    category: "Community",
    tags: ["Local Shopping", "Community Support", "Economic Impact"]
  },
  {
    id: 3,
    title: "The Evolution of Grocery Shopping in India",
    excerpt: "From traditional markets to app-based ordering - the changing landscape of grocery retail in India.",
    image: "/lovable-uploads/afca662e-c634-421e-9dfa-6dc811cad5e9.png",
    author: "Vikram Singh",
    date: "March 10, 2023",
    category: "Industry Trends",
    tags: ["Retail Evolution", "Shopping Trends", "Indian Market"]
  },
  {
    id: 4,
    title: "How DoKirana is Empowering Small Business Owners",
    excerpt: "Stories of Kirana store owners who have grown their business through digital platforms.",
    image: "/lovable-uploads/37abd8ca-0091-4d78-be64-0469d0676335.png",
    author: "Neha Gupta",
    date: "February 15, 2023",
    category: "Success Stories",
    tags: ["Entrepreneur", "Small Business", "Growth Stories"]
  },
  {
    id: 5,
    title: "Balancing Tradition and Innovation in Local Retail",
    excerpt: "How neighborhood stores can maintain their unique character while adopting new technologies.",
    image: "/lovable-uploads/a0d0b563-7fb6-4a6d-be40-4bc9358a403c.png",
    author: "Rahul Sharma",
    date: "January 28, 2023",
    category: "Business Strategy",
    tags: ["Innovation", "Tradition", "Retail Strategy"]
  },
  {
    id: 6,
    title: "The Future of Hyperlocal Delivery in India",
    excerpt: "Insights into emerging trends and challenges in the last-mile delivery ecosystem.",
    image: "/lovable-uploads/fb48dfd0-69fe-4e9b-b085-d8a0cce0f63f.png",
    author: "Vikram Singh",
    date: "January 12, 2023",
    category: "Industry Trends",
    tags: ["Hyperlocal", "Delivery", "Future Trends"]
  }
];

const categories = [
  "All Categories",
  "Digital Transformation",
  "Community",
  "Industry Trends",
  "Success Stories",
  "Business Strategy"
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-dokirana-lighter">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-dokirana-primary mb-6">DoKirana Blog</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">News, insights, and stories from the DoKirana community.</p>
              <div className="flex justify-center gap-2 items-center text-dokirana-primary">
                <a href="/" className="hover:underline">Home</a>
                <ChevronRight size={16} />
                <span>Blog</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Search and Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-72 focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        
        {/* Blog Posts */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-dokirana-primary mb-2">No Results Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="flex items-center mr-4">
                          <Calendar size={14} className="mr-1" />
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <User size={14} className="mr-1" />
                          {post.author}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-dokirana-primary mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-dokirana-light">
                          <Tag size={14} className="mr-1" />
                          {post.category}
                        </div>
                        <a href={`/blog/${post.id}`} className="text-dokirana-primary font-medium hover:underline">Read More</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
