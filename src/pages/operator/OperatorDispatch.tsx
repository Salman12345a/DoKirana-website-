import { useState, useEffect, useRef } from "react";
import {
  Truck,
  Bike,
  Store,
  UtensilsCrossed,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  UserCheck,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import {
  getActiveOrders,
  assignRider,
  getRiders,
  FoodOrder,
  KiranaOrder,
  Rider,
} from "../../services/operatorService";

const OperatorDispatch = () => {
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [kiranaOrders, setKiranaOrders] = useState<KiranaOrder[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPoll, setAutoPoll] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "food" | "kirana">("all");

  // Assign modal state
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; type: "food" | "kirana" } | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignResult, setAssignResult] = useState<{ success: boolean; msg: string } | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrdersAndRiders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError(null);
    try {
      const [ordersRes, ridersRes] = await Promise.allSettled([
        getActiveOrders(),
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
  }, [autoPoll]);

  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRiderId) return;
    setAssigning(true);
    setAssignResult(null);
    try {
      await assignRider({
        orderId: selectedOrder.id,
        riderId: selectedRiderId,
        orderType: selectedOrder.type,
      });
      setAssignResult({ success: true, msg: "Rider assigned successfully!" });
      setTimeout(() => {
        setSelectedOrder(null);
        setSelectedRiderId("");
        setAssignResult(null);
        fetchOrdersAndRiders(true);
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to assign rider";
      setAssignResult({ success: false, msg: message });
    } finally {
      setAssigning(false);
    }
  };

  const onlineRidersCount = riders.filter(
    (r) => (r.availability || r.isAvailable) && r.status === "approved"
  ).length;

  const totalOrders = foodOrders.length + kiranaOrders.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Live Territory Dispatch Desk</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Radar
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time fulfillment requests requiring fleet coordination
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Fleet Availability Status Banner (Image 2) */}
      {onlineRidersCount > 0 ? (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Bike size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-900">Fleet Active & Ready</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 font-bold">
                  {onlineRidersCount} Online
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Automatic Smart Rider Assignment is active across all linked Kirana stores and Restaurants.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-semibold text-emerald-800 bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
            Auto-Dispatch Active
          </span>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-rose-900">Fleet Offline (0 Riders Active)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-800 font-bold">
                  Delivery Paused
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Store deliveries are temporarily paused because 0 riders are online. Orders will queue until a rider logs in.
              </p>
            </div>
          </div>
          <a
            href="/operator/riders"
            className="self-start sm:self-auto text-xs font-bold text-rose-800 bg-white hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-300 transition-colors shadow-sm"
          >
            Manage Fleet Roster →
          </a>
        </div>
      )}

      {/* Quick Summary Filters */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-sm">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl font-medium text-xs transition-all ${
            activeTab === "all"
              ? "bg-teal-700 text-white font-semibold shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Requests ({totalOrders})
        </button>
        <button
          onClick={() => setActiveTab("food")}
          className={`px-4 py-2 rounded-xl font-medium text-xs transition-all ${
            activeTab === "food"
              ? "bg-teal-700 text-white font-semibold shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Food Orders ({foodOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("kirana")}
          className={`px-4 py-2 rounded-xl font-medium text-xs transition-all ${
            activeTab === "kirana"
              ? "bg-teal-700 text-white font-semibold shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Kirana Orders ({kiranaOrders.length})
        </button>
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
          <p className="text-sm text-gray-500">Scanning territory for pending dispatches...</p>
        </div>
      ) : totalOrders === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-gray-900">All Clear! No Pending Dispatches</h3>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            All customer deliveries in your territory are currently assigned and in transit.
          </p>
          <span className="text-[11px] text-gray-400 font-mono">
            Radar scanning territory automatically every 15 seconds.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Food Orders */}
          {(activeTab === "all" || activeTab === "food") &&
            foodOrders.map((order) => (
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

                  <div className="mt-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-mono font-bold text-gray-800">
                        #{order.orderId || order._id.slice(-6)}
                      </span>
                    </div>

                    {order.restaurant && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                        <p className="font-bold text-gray-900">{order.restaurant.name}</p>
                        {order.restaurant.address && (
                          <p className="text-gray-500 line-clamp-1">{order.restaurant.address}</p>
                        )}
                        {order.restaurant.phone && (
                          <p className="text-gray-400 flex items-center gap-1 font-mono">
                            <Phone size={11} /> {order.restaurant.phone}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                      <Clock size={13} />
                      Placed: {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>

                    {/* Smart Dispatched Rider / Queued Status */}
                    {order.deliveryPartner ? (
                      <div className="bg-purple-50/90 border border-purple-200/80 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-800 font-bold flex items-center gap-1.5">
                            <UserCheck size={14} className="text-purple-600" />
                            Assigned Partner
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 font-bold">
                            Smart Dispatched
                          </span>
                        </div>
                        <p className="text-gray-900 font-bold text-xs mt-0.5">{order.deliveryPartner.name}</p>
                        {order.deliveryPartner.phone && (
                          <a
                            href={`tel:${order.deliveryPartner.phone}`}
                            className="text-gray-600 hover:text-purple-700 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone size={11} /> {order.deliveryPartner.phone}
                          </a>
                        )}
                      </div>
                    ) : order.awaitingOperatorRider ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-800 font-bold">
                          <span className="flex items-center gap-1">
                            <AlertCircle size={14} className="text-amber-600" />
                            Queued (No Riders)
                          </span>
                          <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                            Awaiting Rider
                          </span>
                        </div>
                        <p className="text-amber-700 text-[11px]">
                          Order is queued. Will auto-dispatch as soon as a delivery partner logs online.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  {order.deliveryPartner ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 py-2 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-700 truncate">
                        Status: <span className="font-bold text-teal-800 uppercase">{order.status}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder({ id: order._id || order.orderId, type: "food" });
                          setSelectedRiderId("");
                          setAssignResult(null);
                        }}
                        className="text-xs font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                      >
                        Re-assign
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOrder({ id: order._id || order.orderId, type: "food" });
                        setSelectedRiderId("");
                        setAssignResult(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <Bike size={14} />
                      Assign Territory Rider
                    </button>
                  )}
                </div>
              </div>
            ))}

          {/* Kirana Orders */}
          {(activeTab === "all" || activeTab === "kirana") &&
            kiranaOrders.map((order) => (
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

                  <div className="mt-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-mono font-bold text-gray-800">
                        #{order._id.slice(-6)}
                      </span>
                    </div>

                    {order.branch && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                        <p className="font-bold text-gray-900">{order.branch.name}</p>
                        {order.branch.address && (
                          <p className="text-gray-500 line-clamp-1">{order.branch.address}</p>
                        )}
                        {order.branch.phone && (
                          <p className="text-gray-400 flex items-center gap-1 font-mono">
                            <Phone size={11} /> {order.branch.phone}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                      <Clock size={13} />
                      Placed: {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>

                    {/* Smart Dispatched Rider / Queued Status */}
                    {order.deliveryPartner ? (
                      <div className="bg-purple-50/90 border border-purple-200/80 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-800 font-bold flex items-center gap-1.5">
                            <UserCheck size={14} className="text-purple-600" />
                            Assigned Partner
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 font-bold">
                            Smart Dispatched
                          </span>
                        </div>
                        <p className="text-gray-900 font-bold text-xs mt-0.5">{order.deliveryPartner.name}</p>
                        {order.deliveryPartner.phone && (
                          <a
                            href={`tel:${order.deliveryPartner.phone}`}
                            className="text-gray-600 hover:text-purple-700 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone size={11} /> {order.deliveryPartner.phone}
                          </a>
                        )}
                      </div>
                    ) : order.awaitingOperatorRider ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-800 font-bold">
                          <span className="flex items-center gap-1">
                            <AlertCircle size={14} className="text-amber-600" />
                            Queued (No Riders)
                          </span>
                          <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                            Awaiting Rider
                          </span>
                        </div>
                        <p className="text-amber-700 text-[11px]">
                          Order is queued. Will auto-dispatch as soon as a delivery partner logs online.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  {order.deliveryPartner ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 py-2 px-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-700 truncate">
                        Status: <span className="font-bold text-teal-800 uppercase">{order.status}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder({ id: order._id, type: "kirana" });
                          setSelectedRiderId("");
                          setAssignResult(null);
                        }}
                        className="text-xs font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                      >
                        Re-assign
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOrder({ id: order._id, type: "kirana" });
                        setSelectedRiderId("");
                        setAssignResult(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <Bike size={14} />
                      Assign Territory Rider
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Assign Rider Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Bike size={18} className="text-teal-600" />
                Assign Delivery Rider
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-gray-500">
                Choose an active rider registered in your operator territory to dispatch this order.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Available Rider
                </label>
                {riders.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs border border-amber-200">
                    No riders currently found in your territory fleet. Add riders in the Rider Roster section.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {riders.map((rider) => (
                      <div
                        key={rider._id}
                        onClick={() => setSelectedRiderId(rider._id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          selectedRiderId === rider._id
                            ? "bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20"
                            : "bg-white border-gray-200 hover:bg-gray-50 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              selectedRiderId === rider._id
                                ? "bg-teal-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Bike size={15} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{rider.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">{rider.phone}</p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            rider.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {rider.isAvailable ? "Available" : "Busy"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {assignResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    assignResult.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {assignResult.success ? (
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                  )}
                  <span>{assignResult.msg}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignRider}
                  disabled={assigning || !selectedRiderId}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                >
                  {assigning && <Loader2 size={14} className="animate-spin" />}
                  {assigning ? "Assigning..." : "Dispatch Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorDispatch;