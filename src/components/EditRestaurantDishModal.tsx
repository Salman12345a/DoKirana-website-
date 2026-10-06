import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Upload, Plus, Trash2, Star, ThumbsUp, Clock, AlertCircle } from 'lucide-react';
import {
  RestaurantDish,
  PortionVariant,
  AdminMenuCategory,
  restaurantMenuService,
} from '../services/restaurantMenuService';

interface EditRestaurantDishModalProps {
  dish: RestaurantDish | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDish: RestaurantDish) => void;
  existingCategories?: string[];
  adminCategories?: AdminMenuCategory[];
  restaurantId?: string;
  isCreateMode?: boolean;
}

const EditRestaurantDishModal = ({
  dish,
  isOpen,
  onClose,
  onSave,
  existingCategories = [],
  adminCategories: propAdminCategories = [],
  restaurantId,
  isCreateMode = false,
}: EditRestaurantDishModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [vegFlag, setVegFlag] = useState<'veg' | 'non_veg' | 'egg'>('veg');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [prepTime, setPrepTime] = useState<number>(15);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [variants, setVariants] = useState<PortionVariant[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Official AdminJS categories state
  const [officialCategories, setOfficialCategories] = useState<string[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch official AdminJS categories
  useEffect(() => {
    const fetchCats = async () => {
      if (propAdminCategories && propAdminCategories.length > 0) {
        setOfficialCategories(propAdminCategories.map(c => c.name));
        return;
      }

      setLoadingCats(true);
      try {
        const fetched = await restaurantMenuService.getAdminCategories();
        if (fetched && fetched.length > 0) {
          setOfficialCategories(fetched.map(c => c.name));
        } else if (existingCategories.length > 0) {
          setOfficialCategories(existingCategories);
        }
      } catch (err) {
        console.warn('Failed to load AdminJS categories:', err);
        if (existingCategories.length > 0) {
          setOfficialCategories(existingCategories);
        }
      } finally {
        setLoadingCats(false);
      }
    };

    if (isOpen) {
      fetchCats();
    }
  }, [isOpen, propAdminCategories, existingCategories]);

  // Computed categories from AdminJS (ensuring current dish category is retained if present)
  const availableCategories = useMemo(() => {
    const list: string[] = [];
    officialCategories.forEach(cat => {
      if (cat && !list.includes(cat)) {
        list.push(cat);
      }
    });
    if (dish?.category && !list.includes(dish.category)) {
      list.push(dish.category);
    }
    return list;
  }, [officialCategories, dish]);

  useEffect(() => {
    if (dish && !isCreateMode) {
      setName(dish.name || '');
      setDescription(dish.description || '');
      setCategory(dish.category || '');
      setVegFlag(dish.vegFlag || 'veg');
      setBasePrice(dish.basePrice ?? 0);
      setPrepTime(dish.preparationTimeMinutes ?? 15);
      setIsBestseller(Boolean(dish.isBestseller));
      setIsRecommended(Boolean(dish.isRecommended));
      setIsAvailable(dish.isAvailable !== false);
      setVariants(dish.variants ? [...dish.variants] : []);
      setImageUrl(dish.imageUrl || '');
      setImagePreview(dish.imageUrl || '');
      setImageFile(null);
    } else {
      // Default reset for create mode
      setName('');
      setDescription('');
      const defaultCat = officialCategories[0] || existingCategories[0] || 'Biryani';
      setCategory(defaultCat);
      setVegFlag('veg');
      setBasePrice('');
      setPrepTime(15);
      setIsBestseller(false);
      setIsRecommended(false);
      setIsAvailable(true);
      setVariants([]);
      setImageUrl('');
      setImagePreview('');
      setImageFile(null);
    }
    setError(null);
  }, [dish, isCreateMode, isOpen, officialCategories, existingCategories]);

  // Keep category in sync if official categories load after modal is opened
  useEffect(() => {
    if (isCreateMode && !category && officialCategories.length > 0) {
      setCategory(officialCategories[0]);
    }
  }, [isCreateMode, category, officialCategories]);

  if (!isOpen) return null;

  const handleAddVariant = () => {
    setVariants([...variants, { label: '', price: 0, isAvailable: true }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof PortionVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalCategory = category.trim();

    if (!name.trim()) {
      setError('Please provide a dish name.');
      return;
    }
    if (!finalCategory) {
      setError('Please select an official menu category for this dish.');
      return;
    }
    if (basePrice === '' && variants.length === 0) {
      setError('Please provide either a base price or at least one portion variant price.');
      return;
    }

    setIsSaving(true);
    try {
      let finalImageUrl = imageUrl;

      // If user picked a new image file, upload it first
      if (imageFile) {
        setIsUploadingImage(true);
        try {
          finalImageUrl = await restaurantMenuService.uploadDishImage(imageFile, restaurantId);
        } catch (uploadErr: any) {
          console.warn('Image upload failed, proceeding with URL:', uploadErr);
        } finally {
          setIsUploadingImage(false);
        }
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: finalCategory,
        vegFlag,
        basePrice: Number(basePrice) || (variants.length > 0 ? Number(variants[0].price) : 0),
        preparationTimeMinutes: Number(prepTime) || 15,
        isBestseller,
        isRecommended,
        isAvailable,
        imageUrl: finalImageUrl || undefined,
        variants: variants
          .filter(v => v.label.trim() && Number(v.price) > 0)
          .map(v => ({
            label: v.label.trim(),
            price: Number(v.price),
            isAvailable: v.isAvailable !== false,
          })),
      };

      if (isCreateMode) {
        const created = await restaurantMenuService.createRestaurantDish(payload, restaurantId);
        onSave(created);
      } else if (dish) {
        const updated = await restaurantMenuService.updateRestaurantDish(dish._id, payload, restaurantId);
        onSave(updated);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update dish details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto border border-gray-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 via-white to-amber-50/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h2 className="text-xl font-bold text-gray-900">
                {isCreateMode ? 'Add New Menu Dish' : 'Edit Menu Dish'}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isCreateMode
                ? 'Create a new dish for the restaurant food menu'
                : `Updating details for "${dish?.name || 'Dish'}"`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Dish Name & Dietary Indicator */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Dish Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Chicken Dum Biryani, Paneer Butter Masala"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                required
              />
            </div>

            {/* Food Dietary Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Dietary Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setVegFlag('veg')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    vegFlag === 'veg'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-xs flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  Veg
                </button>

                <button
                  type="button"
                  onClick={() => setVegFlag('non_veg')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    vegFlag === 'non_veg'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-xs ring-2 ring-rose-500/20'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-3.5 h-3.5 border-2 border-rose-600 rounded-xs flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  </span>
                  Non-Veg
                </button>

                <button
                  type="button"
                  onClick={() => setVegFlag('egg')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    vegFlag === 'egg'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs ring-2 ring-amber-500/20'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-3.5 h-3.5 border-2 border-amber-600 rounded-xs flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  </span>
                  Contains Egg
                </button>
              </div>
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Menu Category <span className="text-red-500">*</span>
                </label>
                {loadingCats && (
                  <span className="text-[10px] text-orange-600 animate-pulse font-medium">
                    Loading AdminJS categories...
                  </span>
                )}
              </div>

              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white font-medium"
                required
              >
                {availableCategories.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  availableCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                )}
              </select>

              {/* Quick Category Selection matching dokirana-eats partner app listing */}
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-gray-500 mb-1.5 flex items-center justify-between">
                  <span>Categories from AdminJS:</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {availableCategories.length} available
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-gray-50 rounded-xl border border-gray-100">
                  {availableCategories.map(cat => {
                    const isSelected = category.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-xs scale-102'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Base Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 199"
                  className="w-full pl-8 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Portion Variants Builder */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Portion Sizes & Variants (Optional)
                </h3>
                <p className="text-[11px] text-gray-500">
                  e.g., Half / Full, Single / Family Pack, 250ml / 500ml
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-orange-600 rounded-xl text-xs font-semibold hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Portion
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-1">
                No portion variants added. The standard Base Price will be used.
              </p>
            ) : (
              <div className="space-y-2 pt-1">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200">
                    <input
                      type="text"
                      value={v.label}
                      onChange={e => handleVariantChange(idx, 'label', e.target.value)}
                      placeholder="Size/Portion (e.g. Half)"
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={v.price || ''}
                        onChange={e => handleVariantChange(idx, 'price', Number(e.target.value))}
                        placeholder="Price"
                        className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prep Time & Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Preparation Time (Mins)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={prepTime}
                  onChange={e => setPrepTime(Number(e.target.value))}
                  placeholder="15"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Item Badges & Availability
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={e => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded-sm border-gray-300 focus:ring-orange-500"
                  />
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Bestseller
                </label>

                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecommended}
                    onChange={e => setIsRecommended(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded-sm border-gray-300 focus:ring-orange-500"
                  />
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                  Chef's Pick
                </label>

                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={e => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm border-gray-300 focus:ring-emerald-500"
                  />
                  In Stock
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Dish Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Crisp aroma, slow cooked authentic spices, served with raita and salan..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none font-normal"
            />
          </div>

          {/* Dish Image */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Dish Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setImageUrl('');
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0 bg-gray-50/50">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] mt-1">No Image</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo from Device
                </button>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => {
                    setImageUrl(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="Or paste public Image URL..."
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-500">
            {isCreateMode
              ? 'New dish will go live immediately on DoKirana Eats'
              : 'Updates sync instantly to the restaurant menu catalog'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || isUploadingImage}
              className="px-5 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSaving || isUploadingImage ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : isCreateMode ? (
                'Create Dish'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurantDishModal;
