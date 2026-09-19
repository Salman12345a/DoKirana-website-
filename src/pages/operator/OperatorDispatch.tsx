import { useState, useEffect, useRef, useMemo } from "react";
import {
  Bike,
  Store,
  UtensilsCrossed,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  Calendar,
  User,
} from "lucide-react";
import {
  getActiveOrders,
  getRiders,
  FoodOrder,
  KiranaOrder,
  Rider,
} from "../../services/operatorService";

const formatAddress = (address?: unknown): string => {
  if (!address) return "";
  if (typeof address === "string") return address;
  if (typeof address === "object" && address !== null) {
    const addr = address as Record<string, unknown>;
    const parts = [addr.street, addr.area, addr.city, addr.pincode]
      .filter((part): part is string | number => typeof part === "string" || typeof part === "number")
      .map(String)
      .filter((s) => s.trim().length > 0);
    return parts.join(", ");
  }
  return String(address);
};

const isToday = (dateString?: string) => {
  if (!dateString) return false;
  const orderDate = new Date(dateString);
  const now = new Date();
  return (
    orderDate.getDate() === now.getDate() &&
    orderDate.getMonth() === now.getMonth() &&
    orderDate.getFullYear() === now.getFullYear()
  );
};

const formatOrderTime = (dateString: string) => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Recently";
  if (isToday(dateString)) {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OperatorDispatch = () => {
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [kiranaOrders, setKiranaOrders] = useState<KiranaOrder[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPoll, setAutoPoll] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "food" | "kirana">("all");
  const [dateFilter, setDateFilter] = useState<"today" | "all">("today");

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrdersAndRiders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError(null);
    try {
      const [ordersRes, ridersRes] = await Promise.allSettled([
        getActiveOrders({ today: dateFilter === "today" }),
        getRiders(),
      ]);

      if (ordersRes.status === "fulfilled" && ordersRes.value.status?.toLowerCase() === "success") {
        setFoodOrders(ordersRes.value.activeOrders?.foodOrders || []);
        setKiranaOrders(ordersRes.value.activeOrders?.kiranaOrders || []);
      }

      if (ridersRes.status === "fulfilled" && ridersRes.value.status?.toLowerCase() === "success") {
        setRiders(ridersRes.value.riders || []);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load live orders";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndRiders();

    if (autoPoll) {
      pollIntervalRef.current = setInterval(() => {
        fetchOrdersAndRiders();
      }, 15000);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [autoPoll, dateFilter]);

  const onlineRidersCount = riders.filter(
    (r) => (r.availability || r.isAvailable) && r.status === "approved"
  ).length;

  // Filter orders by date range
  const visibleFoodOrders = useMemo(() => {
    if (dateFilter === "all") return foodOrders;
    return foodOrders.filter((o) => isToday(o.createdAt));
  }, [foodOrders, dateFilter]);

  const visibleKiranaOrders = useMemo(() => {
    if (dateFilter === "all") return kiranaOrders;
    return kiranaOrders.filter((o) => isToday(o.createdAt));
  }, [kiranaOrders, dateFilter]);

  const totalVisibleOrders = visibleFoodOrders.length + visibleKiranaOrders.length;
  const totalAllOrders = foodOrders.length + kiranaOrders.length;
  const pastOrdersCount = totalAllOrders - totalVisibleOrders;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Live Territory Dispatch Monitor</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Radar
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time fulfillment tracking & live order status across your territory (Monitoring Mode)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoPoll}
              onChange={(e) => setAutoPoll(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 border-gray-300 w-3.5 h-3.5"
            />
            Auto-refresh (15s)
          </label>

          <button
            onClick={() => fetchOrdersAndRiders(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold px-3.5 py-2 rounded-xl border border-teal-200/60 transition-all"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh Now
          </button>
        </div>
      </div>

      {/* Fleet Status Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 px-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
            onlineRidersCount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
          }`}>
            <Bike size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">
                Territory Fleet: {onlineRidersCount} {onlineRidersCount === 1 ? "Rider" : "Riders"} Online
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                onlineRidersCount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
              }`}>
                {onlineRidersCount > 0 ? "Active Fleet" : "Idle"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Automated system dispatches orders directly to available delivery partners.
            </p>
          </div>
        </div>

        <a
          href="/operator/riders"
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 self-start sm:self-auto underline"
        >
          View Territory Riders →
        </a>
      </div>

      {/* Filter Tabs (Category + Date Range) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 text-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === "all"
                ? "bg-teal-700 text-white font-semibold shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Requests ({totalVisibleOrders})
          </button>
          <button
            onClick={() => setActiveTab("kirana")}
            className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === "kirana"
                ? "bg-teal-700 text-white font-semibold shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Kirana Orders ({visibleKiranaOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("food")}
            className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === "food"
                ? "bg-teal-700 text-white font-semibold shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Food Orders ({visibleFoodOrders.length})
          </button>
        </div>

        {/* Date Filter (Today vs All) */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setDateFilter("today")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              dateFilter === "today"
                ? "bg-white text-teal-800 font-bold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Today's Orders
          </button>
          <button
            onClick={() => setDateFilter("all")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              dateFilter === "all"
                ? "bg-white text-teal-800 font-bold shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All History {pastOrdersCount > 0 && dateFilter === "today" ? `(+${pastOrdersCount})` : ""}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => fetchOrdersAndRiders(true)} className="font-bold underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Scanning territory for live orders...</p>
        </div>
      ) : totalVisibleOrders === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-gray-900">
            {dateFilter === "today" ? "All Clear! No Active Orders Today" : "No Orders Found"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            {dateFilter === "today"
              ? "All customer deliveries for today in your territory are clear and up to date."
              : "No orders matching your selected filter."}
          </p>
          {dateFilter === "today" && pastOrdersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 mb-2">
                {pastOrdersCount} past order records from previous days exist in history.
              </p>
              <button
                onClick={() => setDateFilter("all")}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline"
              >
                View all previous records →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Food Orders */}
          {(activeTab === "all" || activeTab === "food") &&
            visibleFoodOrders.map((order) => (
              <div
                key={order._id || order.orderId}
                className="bg-white rounded-2xl border border-orange-200/80 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                      <UtensilsCrossed size={13} />
                      Restaurant Food Order
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      ₹{order.totalPrice?.toLocaleString("en-IN") || 0}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-mono font-bold text-gray-800">
                        #{order.orderId || order._id.slice(-6)}
                      </span>
                    </div>

                    {order.restaurant && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                        <p className="font-bold text-gray-900">{order.restaurant.name}</p>
                        {Boolean(formatAddress(order.restaurant.address)) && (
                          <p className="text-gray-500 line-clamp-1">{formatAddress(order.restaurant.address)}</p>
                        )}
                        {order.restaurant.phone && (
                          <p className="text-gray-400 flex items-center gap-1 font-mono">
                            <Phone size={11} /> {order.restaurant.phone}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-0.5">
                      <Clock size={13} />
                      Placed: {formatOrderTime(order.createdAt)}
                    </div>

                    {/* Assigned Rider Info (if assigned) */}
                    {order.deliveryPartner && (
                      <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-gray-500 text-[11px]">
                          <span className="font-semibold flex items-center gap-1">
                            <User size={12} className="text-teal-700" />
                            Delivery Rider
                          </span>
                        </div>
                        <p className="text-gray-900 font-bold text-xs mt-0.5">{order.deliveryPartner.name}</p>
                        {order.deliveryPartner.phone && (
                          <a
                            href={`tel:${order.deliveryPartner.phone}`}
                            className="text-gray-600 hover:text-teal-700 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone size={11} /> {order.deliveryPartner.phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-gray-500 text-[11px]">Fulfillment Status:</span>
                  <span className="font-bold text-teal-900 uppercase text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-100">
                    {order.status || "In Progress"}
                  </span>
                </div>
              </div>
            ))}

          {/* Kirana Orders */}
          {(activeTab === "all" || activeTab === "kirana") &&
            visibleKiranaOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-teal-200/80 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                      <Store size={13} />
                      Kirana Grocery Order
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      ₹{order.totalPrice?.toLocaleString("en-IN") || 0}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-mono font-bold text-gray-800">
                        #{order._id.slice(-6)}
                      </span>
                    </div>

                    {order.branch && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                        <p className="font-bold text-gray-900">{order.branch.name}</p>
                        {Boolean(formatAddress(order.branch.address)) && (
                          <p className="text-gray-500 line-clamp-1">{formatAddress(order.branch.address)}</p>
                        )}
                        {order.branch.phone && (
                          <p className="text-gray-400 flex items-center gap-1 font-mono">
                            <Phone size={11} /> {order.branch.phone}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-0.5">
                      <Clock size={13} />
                      Placed: {formatOrderTime(order.createdAt)}
                    </div>

                    {/* Assigned Rider Info (if assigned) */}
                    {order.deliveryPartner && (
                      <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-gray-500 text-[11px]">
                          <span className="font-semibold flex items-center gap-1">
                            <User size={12} className="text-teal-700" />
                            Delivery Rider
                          </span>
                        </div>
                        <p className="text-gray-900 font-bold text-xs mt-0.5">{order.deliveryPartner.name}</p>
                        {order.deliveryPartner.phone && (
                          <a
                            href={`tel:${order.deliveryPartner.phone}`}
                            className="text-gray-600 hover:text-teal-700 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone size={11} /> {order.deliveryPartner.phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-gray-500 text-[11px]">Fulfillment Status:</span>
                  <span className="font-bold text-teal-900 uppercase text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-100">
                    {order.status || "In Progress"}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OperatorDispatch;