import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UtensilsCrossed,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  Store,
  ExternalLink,
} from 'lucide-react';
import { RestaurantProfile } from '../services/restaurantMenuService';

const RestaurantManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);

  useEffect(() => {
    if (location.state && (location.state.restaurant || location.state.branch)) {
      setRestaurant(location.state.restaurant || location.state.branch);
    } else {
      navigate('/admin/dashboard');
    }
  }, [location, navigate]);

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  const addressString = [
    restaurant.address?.street,
    restaurant.address?.area,
    restaurant.address?.city,
    restaurant.address?.state,
    restaurant.address?.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-orange-50/40 via-white to-amber-50/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <UtensilsCrossed className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {restaurant.name}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Restaurant ID:{' '}
                    <span className="font-mono font-semibold text-gray-800">{restaurant._id}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  restaurant.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : restaurant.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                Status: {restaurant.status || 'Active'}
              </span>

              {restaurant.type && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 capitalize">
                  {restaurant.type.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Action: Menu & Product Listing */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Restaurant Menu & Product Listing
                </h2>
                <p className="text-xs text-orange-100 mt-1 max-w-lg">
                  Access the live food menu catalog for {restaurant.name}. View all categories, update
                  dish details, portion pricing, and toggle in-stock availability.
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/admin/manage-restaurant/${restaurant._id}/menu`, {
                    state: { restaurant },
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-orange-700 font-bold text-sm rounded-xl hover:bg-orange-50 transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                Manage Menu & Products
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Restaurant Details */}
              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Establishment Details
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200/50">
                    <span className="text-gray-500">Business Name:</span>
                    <span className="font-semibold text-gray-900">{restaurant.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/50">
                    <span className="text-gray-500">Owner Name:</span>
                    <span className="font-semibold text-gray-900">{restaurant.ownerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/50">
                    <span className="text-gray-500">Phone Number:</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {restaurant.phone}
                    </span>
                  </div>
                  {restaurant.branchEmail && (
                    <div className="flex justify-between py-1 border-b border-gray-200/50">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-semibold text-gray-900">{restaurant.branchEmail}</span>
                    </div>
                  )}
                  {restaurant.openingTime && restaurant.closingTime && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Operating Hours:</span>
                      <span className="font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {restaurant.openingTime} – {restaurant.closingTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance & Cuisines */}
              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Compliance & Cuisines
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200/50">
                    <span className="text-gray-500">FSSAI License:</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {restaurant.fssaiNumber || 'Recorded on File'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/50">
                    <span className="text-gray-500">Store Live Status:</span>
                    <span
                      className={`font-bold ${
                        restaurant.isOpen !== false ? 'text-emerald-700' : 'text-gray-500'
                      }`}
                    >
                      {restaurant.isOpen !== false ? 'Open for Orders' : 'Temporarily Closed'}
                    </span>
                  </div>

                  {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
                    <div className="pt-1">
                      <span className="text-gray-500 block mb-1.5">Specialty Cuisines:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {restaurant.cuisineTypes.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white border border-gray-200 text-gray-800 rounded-md text-[11px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                Store Location & Address
              </h3>
              <p className="text-xs text-gray-800 leading-relaxed font-medium">
                {addressString || 'Address details registered in partner record'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagementPage;
