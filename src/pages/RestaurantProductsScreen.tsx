import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  PlusCircle,
  Edit3,
  Star,
  ThumbsUp,
  Clock,
  UtensilsCrossed,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import {
  RestaurantDish,
  RestaurantProfile,
  AdminMenuCategory,
  restaurantMenuService,
} from '../services/restaurantMenuService';
import EditRestaurantDishModal from '../components/EditRestaurantDishModal';

// Veg / Non-Veg / Egg Indicator matching Swiggy / DkEats standard
const VegIndicator = ({ vegFlag }: { vegFlag: 'veg' | 'non_veg' | 'egg' }) => {
  const isVeg = vegFlag === 'veg';
  const isEgg = vegFlag === 'egg';

  const borderColor = isVeg ? 'border-emerald-600' : isEgg ? 'border-amber-600' : 'border-rose-600';
  const dotColor = isVeg ? 'bg-emerald-600' : isEgg ? 'bg-amber-600' : 'bg-rose-600';
  const title = isVeg ? 'Pure Veg' : isEgg ? 'Contains Egg' : 'Non-Veg';

  return (
    <div
      className={`w-4 h-4 border-2 ${borderColor} rounded-xs flex items-center justify-center p-0.5 shrink-0 bg-white shadow-2xs`}
      title={title}
    >
      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
    </div>
  );
};

const RestaurantProductsScreen = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
  const [menu, setMenu] = useState<Record<string, RestaurantDish[]>>({});
  const [adminCategories, setAdminCategories] = useState<AdminMenuCategory[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [availableItems, setAvailableItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non_veg' | 'egg'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals & Actions
  const [editingDish, setEditingDish] = useState<RestaurantDish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [togglingDishId, setTogglingDishId] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId) {
      loadData(restaurantId);
    }
  }, [restaurantId]);

  const loadData = async (rId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Load restaurant profile
      try {
        const profile = await restaurantMenuService.getRestaurantDetails(rId);
        setRestaurant(profile);
      } catch (profileErr) {
        console.warn('Could not load detailed restaurant profile:', profileErr);
      }

      // 2. Load restaurant menu items & official AdminJS categories
      const [menuData, officialCats] = await Promise.all([
        restaurantMenuService.getRestaurantMenu(rId),
        restaurantMenuService.getAdminCategories(),
      ]);
      setMenu(menuData.menu);
      setTotalItems(menuData.totalItems);
      setAvailableItems(menuData.availableItems);
      setAdminCategories(officialCats);
    } catch (err: any) {
      console.error('Failed to load restaurant menu:', err);
      setError(err.message || 'Failed to load restaurant menu products.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (dish: RestaurantDish) => {
    if (!dish._id) return;
    const newStatus = !dish.isAvailable;
    setTogglingDishId(dish._id);

    // Optimistic update
    setMenu(prev => {
      const updated: Record<string, RestaurantDish[]> = {};
      Object.keys(prev).forEach(cat => {
        updated[cat] = prev[cat].map(d =>
          d._id === dish._id ? { ...d, isAvailable: newStatus } : d
        );
      });
      return updated;
    });

    setAvailableItems(prev => (newStatus ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await restaurantMenuService.toggleDishAvailability(dish._id, newStatus, restaurantId);
      showSuccess(`"${dish.name}" is now ${newStatus ? 'In Stock' : 'Out of Stock'}.`);
    } catch (err: any) {
      console.error('Failed to toggle availability:', err);
      // Revert on error
      if (restaurantId) loadData(restaurantId);
      setError('Could not update dish stock status.');
    } finally {
      setTogglingDishId(null);
    }
  };

  const handleDishSaved = (updatedDish: RestaurantDish) => {
    setMenu(prev => {
      const updated: Record<string, RestaurantDish[]> = {};
      const targetCat = updatedDish.category;

      Object.keys(prev).forEach(cat => {
        // Remove old instance if category changed
        updated[cat] = prev[cat].filter(d => d._id !== updatedDish._id);
      });

      // Insert into target category
      if (!updated[targetCat]) {
        updated[targetCat] = [];
      }
      updated[targetCat] = [...updated[targetCat], updatedDish];

      return updated;
    });

    showSuccess(
      isCreateMode
        ? `"${updatedDish.name}" has been created successfully.`
        : `"${updatedDish.name}" has been updated.`
    );

    // Re-sync totals
    if (restaurantId) {
      restaurantMenuService.getRestaurantMenu(restaurantId).then(data => {
        setTotalItems(data.totalItems);
        setAvailableItems(data.availableItems);
      });
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleOpenEditModal = (dish: RestaurantDish) => {
    setEditingDish(dish);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingDish(null);
    setIsCreateMode(true);
    setIsModalOpen(true);
  };

  // Extract all categories list
  const allCategories = useMemo(() => {
    return Object.keys(menu);
  }, [menu]);

  // Flatten and filter items
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return Object.entries(menu)
      .map(([cat, items]) => {
        if (selectedCategory !== 'all' && selectedCategory !== cat) {
          return { category: cat, items: [] };
        }

        const filtered = items.filter(dish => {
          // Dietary filter
          if (vegFilter !== 'all') {
            if (vegFilter === 'veg' && dish.vegFlag !== 'veg') return false;
            if (vegFilter === 'non_veg' && dish.vegFlag !== 'non_veg') return false;
            if (vegFilter === 'egg' && dish.vegFlag !== 'egg') return false;
          }

          // Stock filter
          if (stockFilter === 'in_stock' && !dish.isAvailable) return false;
          if (stockFilter === 'out_of_stock' && dish.isAvailable) return false;

          // Search query
          if (q) {
            const matchesName = dish.name.toLowerCase().includes(q);
            const matchesCat = dish.category.toLowerCase().includes(q);
            const matchesDesc = dish.description?.toLowerCase().includes(q);
            if (!matchesName && !matchesCat && !matchesDesc) return false;
          }

          return true;
        });

        return { category: cat, items: filtered };
      })
      .filter(sec => sec.items.length > 0);
  }, [menu, searchQuery, vegFilter, stockFilter, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Top Navigation & Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Title & Back button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                title="Back to Admin Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                    <UtensilsCrossed className="w-4 h-4" />
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    {restaurant?.name || 'Restaurant'} • Menu Catalog
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>Restaurant ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">
                    {restaurantId}
                  </span>
                  {restaurant?.type && (
                    <>
                      <span>•</span>
                      <span className="capitalize font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                        {restaurant.type.replace('_', ' ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Actions & Status Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Refresh button */}
              <button
                onClick={() => restaurantId && loadData(restaurantId)}
                disabled={isLoading}
                className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
                title="Refresh Menu"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* Add New Dish */}
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-orange-700 transition-all shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Dish
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/60 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total Menu Items:</span>
              <span className="font-extrabold text-orange-900 text-sm">{totalItems}</span>
            </div>

            <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Live on DoKirana:</span>
              <span className="font-extrabold text-emerald-800 text-sm">{availableItems}</span>
            </div>

            <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/60 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Out of Stock:</span>
              <span className="font-extrabold text-rose-800 text-sm">
                {Math.max(0, totalItems - availableItems)}
              </span>
            </div>

            <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/60 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Menu Categories:</span>
              <span className="font-extrabold text-purple-900 text-sm">{allCategories.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Toast / Feedback alerts */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dishes by name, ingredients, or category..."
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 font-medium"
              />
            </div>

            {/* Dietary Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  vegFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  vegFilter === 'veg'
                    ? 'bg-white text-emerald-700 shadow-2xs ring-1 ring-emerald-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Veg
              </button>

              <button
                type="button"
                onClick={() => setVegFilter('non_veg')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  vegFilter === 'non_veg'
                    ? 'bg-white text-rose-700 shadow-2xs ring-1 ring-rose-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Non-Veg
              </button>

              <button
                type="button"
                onClick={() => setVegFilter('egg')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  vegFilter === 'egg'
                    ? 'bg-white text-amber-700 shadow-2xs ring-1 ring-amber-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                Egg
              </button>
            </div>

            {/* Stock Availability Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  stockFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Stock
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('in_stock')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  stockFilter === 'in_stock'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                In Stock
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('out_of_stock')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  stockFilter === 'out_of_stock'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>

          {/* Category Horizontal Filter Pills */}
          {allCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories ({totalItems})
              </button>

              {allCategories.map(cat => {
                const count = menu[cat]?.length || 0;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-orange-700 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
            <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-gray-900">Loading Restaurant Menu...</h3>
            <p className="text-xs text-gray-500 mt-1">
              Fetching catalog items, variants, and live availability
            </p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Menu Items Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              {searchQuery || vegFilter !== 'all' || stockFilter !== 'all'
                ? 'No items match your active search and dietary filters. Try clearing some filters.'
                : 'No dishes have been added to this restaurant menu yet. Click "Add New Dish" to add the first item.'}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add First Dish
            </button>
          </div>
        ) : (
          /* Categorized Sections */
          <div className="space-y-8">
            {filteredSections.map(section => (
              <section key={section.category} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1 h-5 bg-orange-500 rounded-full" />
                    <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
                      {section.category}
                    </h2>
                    <span className="px-2 py-0.5 bg-orange-100/70 text-orange-800 rounded-full text-xs font-bold">
                      {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Dish Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {section.items.map(dish => {
                    const hasVariants = Boolean(dish.variants && dish.variants.length > 0);
                    const basePrice = Number(dish.basePrice || 0);
                    const minVariantPrice = hasVariants
                      ? Math.min(...dish.variants.map(v => Number(v.price) || 0))
                      : basePrice;
                    const maxVariantPrice = hasVariants
                      ? Math.max(...dish.variants.map(v => Number(v.price) || 0))
                      : basePrice;
                    const displayPrice = basePrice > 0 ? basePrice : minVariantPrice;

                    return (
                      <div
                        key={dish._id}
                        className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                          dish.isAvailable
                            ? 'border-gray-200/90'
                            : 'border-gray-200 bg-gray-50/70 opacity-80'
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Left Column: Details */}
                          <div className="flex-1 space-y-2">
                            {/* Meta row: Veg/Non-veg & Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <VegIndicator vegFlag={dish.vegFlag} />

                              {dish.isBestseller && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  Bestseller
                                </span>
                              )}

                              {dish.isRecommended && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                  <ThumbsUp className="w-3 h-3 text-blue-500" />
                                  Chef's Pick
                                </span>
                              )}
                            </div>

                            {/* Dish Name */}
                            <h3
                              className={`text-base font-bold text-gray-900 leading-snug ${
                                !dish.isAvailable ? 'text-gray-500' : ''
                              }`}
                            >
                              {dish.name}
                            </h3>

                            {/* Price Section */}
                            <div className="space-y-1.5 pt-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-extrabold text-gray-900">
                                  ₹{displayPrice}
                                </span>

                                {hasVariants && minVariantPrice !== maxVariantPrice && (
                                  <span className="text-xs text-gray-500 font-medium">
                                    (₹{minVariantPrice} – ₹{maxVariantPrice})
                                  </span>
                                )}

                                {hasVariants && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                    <Layers className="w-3 h-3" />
                                    {dish.variants.length} Portions
                                  </span>
                                )}
                              </div>

                              {/* Portion Variant Pills */}
                              {hasVariants && (
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                  {dish.variants.map((v, vIdx) => (
                                    <span
                                      key={vIdx}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-[11px] font-medium text-gray-700 border border-gray-200/80"
                                    >
                                      <span>{v.label}:</span>
                                      <span className="font-bold text-gray-900">₹{v.price}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            {dish.description && (
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed pt-1 font-normal">
                                {dish.description}
                              </p>
                            )}
                          </div>

                          {/* Right Column: Dish Photo & Stock Toggle */}
                          <div className="flex flex-col items-center justify-between shrink-0 space-y-3">
                            {/* Photo Thumbnail */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs">
                              {dish.imageUrl ? (
                                <img
                                  src={dish.imageUrl}
                                  alt={dish.name}
                                  className="w-full h-full object-cover"
                                  onError={e => {
                                    // Fallback to placeholder on broken image
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-orange-50/50">
                                  <UtensilsCrossed className="w-8 h-8 text-orange-400 mb-1" />
                                  <span className="text-[10px] text-gray-400 font-medium">No Image</span>
                                </div>
                              )}
                            </div>

                            {/* Stock Toggle Switch */}
                            <div className="flex items-center gap-2 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200">
                              <span
                                className={`text-[11px] font-bold ${
                                  dish.isAvailable ? 'text-emerald-700' : 'text-gray-500'
                                }`}
                              >
                                {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                              </span>

                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={dish.isAvailable}
                                  disabled={togglingDishId === dish._id}
                                  onChange={() => handleToggleAvailability(dish)}
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4.5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Prep time & Update Access Only (NO DELETE) */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{dish.preparationTimeMinutes || 15} mins prep</span>
                          </div>

                          {/* Product Update Access Only - No delete access */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(dish)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200/80 rounded-xl text-xs font-semibold hover:bg-orange-100 transition-all cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Edit / Create Dish Modal */}
      {isModalOpen && (
        <EditRestaurantDishModal
          dish={editingDish}
          isOpen={isModalOpen}
          isCreateMode={isCreateMode}
          existingCategories={allCategories}
          adminCategories={adminCategories}
          restaurantId={restaurantId}
          onClose={() => setIsModalOpen(false)}
          onSave={handleDishSaved}
        />
      )}
    </div>
  );
};

export default RestaurantProductsScreen;
