
import { useState } from 'react';
import { Search } from 'lucide-react';

const LocationFinder = () => {
  const [pincode, setPincode] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim()) {
      setSearchPerformed(true);
      console.log('Searching for stores near pincode:', pincode);
    }
  };

  return (
    <section className="section-padding bg-dokirana-lighter">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dokirana-primary mb-4">Find Kirana Stores Near You</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Enter your pincode to see partner Kirana stores available in your area.
          </p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-4 mb-12">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter your pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dokirana-primary focus:outline-none"
                required
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Search size={20} />
              Search
            </button>
          </form>
          
          {searchPerformed && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-dokirana-primary mb-6 text-center">Kirana Stores Near You</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((store) => (
                  <div key={store} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold text-dokirana-primary mb-2">Sharma Kirana Store</h4>
                    <p className="text-gray-600 mb-3">123 Market Street, Neighborhood</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">Open Now</span>
                      <span className="text-sm text-gray-500">2.3 km away</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <a href="#download" className="btn-primary">Download App to Order</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationFinder;
