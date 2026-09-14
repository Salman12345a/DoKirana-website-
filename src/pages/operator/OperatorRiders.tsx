import { useState, useEffect, useRef } from "react";
import {
  Bike,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Phone,
  CheckCircle2,
  Plus,
  Trash2,
  UserPlus,
  Link as LinkIcon,
  Shield,
  Truck,
  X,
  Upload,
  Camera,
  FileCheck,
  FileText,
  User,
  CreditCard,
  Clock,
} from "lucide-react";
import {
  getRiders,
  linkRiderByPhone,
  registerNewRider,
  removeRiderFromFleet,
  uploadOperatorDocument,
  Rider,
} from "../../services/operatorService";

interface DocUploadState {
  file: File | null;
  url: string;
  uploading: boolean;
  error: string | null;
}

const emptyDoc = (): DocUploadState => ({
  file: null,
  url: "",
  uploading: false,
  error: null,
});

const OperatorRiders = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "available" | "busy">("all");

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<"link" | "register">("link");
  const [actionLoading, setActionLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Quick link state
  const [linkPhone, setLinkPhone] = useState("");

  // Register state (matching dkbranch app fields)
  const [regForm, setRegForm] = useState({
    name: "",
    phone: "",
    age: "25",
    gender: "male" as "male" | "female" | "other",
    licenseNumber: "",
    rcNumber: "",
  });

  // 5 Documents matching dkbranch app
  const [docPhoto, setDocPhoto] = useState<DocUploadState>(emptyDoc());
  const [docLicense, setDocLicense] = useState<DocUploadState>(emptyDoc());
  const [docRc, setDocRc] = useState<DocUploadState>(emptyDoc());
  const [docAadhaarFront, setDocAadhaarFront] = useState<DocUploadState>(emptyDoc());
  const [docAadhaarBack, setDocAadhaarBack] = useState<DocUploadState>(emptyDoc());

  // Remove confirmation state
  const [riderToRemove, setRiderToRemove] = useState<Rider | null>(null);

  const fetchRiderList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRiders();
      if (res.status?.toLowerCase() === "success") {
        setRiders(res.riders || []);
      } else {
        setError((res as { message?: string }).message || "Failed to load rider fleet");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load riders";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderList();
  }, []);

  // Generic document uploader to GCP bucket
  const uploadDoc = async (
    file: File,
    docType: string,
    setDoc: React.Dispatch<React.SetStateAction<DocUploadState>>
  ) => {
    setDoc((prev) => ({ ...prev, file, uploading: true, error: null }));
    try {
      const res = await uploadOperatorDocument(file, docType, regForm.phone || "unassigned");
      if (res.status?.toLowerCase() === "success" && res.url) {
        setDoc({ file, url: res.url, uploading: false, error: null });
      } else {
        throw new Error(res.message || "Upload failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setDoc((prev) => ({ ...prev, uploading: false, error: message }));
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkPhone.trim() || linkPhone.length < 10) return;
    setActionLoading(true);
    setModalMsg(null);
    try {
      const res = await linkRiderByPhone(linkPhone.trim());
      setModalMsg({ type: "success", text: res.message || "Rider successfully linked to your fleet!" });
      setLinkPhone("");
      fetchRiderList();
      setTimeout(() => {
        setShowModal(false);
        setModalMsg(null);
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to link rider";
      setModalMsg({ type: "error", text: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone || !regForm.licenseNumber || !regForm.rcNumber) {
      setModalMsg({ type: "error", text: "Please fill in all required personal and vehicle details." });
      return;
    }

    // Check that documents are uploaded
    const missingDocs: string[] = [];
    if (!docPhoto.url) missingDocs.push("Rider Photo");
    if (!docLicense.url) missingDocs.push("Driving License");
    if (!docRc.url) missingDocs.push("Vehicle RC");
    if (!docAadhaarFront.url) missingDocs.push("Aadhaar Front");
    if (!docAadhaarBack.url) missingDocs.push("Aadhaar Back");

    if (missingDocs.length > 0) {
      setModalMsg({
        type: "error",
        text: `Please upload all required KYC documents matching the branch onboarding process: ${missingDocs.join(", ")}`,
      });
      return;
    }

    setActionLoading(true);
    setModalMsg(null);

    const documents = [
      { type: "photo", url: docPhoto.url },
      { type: "license", url: docLicense.url },
      { type: "rc", url: docRc.url },
      { type: "aadhaarFront", url: docAadhaarFront.url },
      { type: "aadhaarBack", url: docAadhaarBack.url },
    ];

    try {
      const res = await registerNewRider({
        name: regForm.name.trim(),
        phone: regForm.phone.trim(),
        age: parseInt(regForm.age, 10) || 25,
        gender: regForm.gender,
        licenseNumber: regForm.licenseNumber.trim(),
        rcNumber: regForm.rcNumber.trim(),
        documents,
      });
      setModalMsg({
        type: "success",
        text: res.message || "Rider submitted successfully! Status is Pending Verification awaiting KYC approval.",
      });

      // Reset form
      setRegForm({
        name: "",
        phone: "",
        age: "25",
        gender: "male",
        licenseNumber: "",
        rcNumber: "",
      });
      setDocPhoto(emptyDoc());
      setDocLicense(emptyDoc());
      setDocRc(emptyDoc());
      setDocAadhaarFront(emptyDoc());
      setDocAadhaarBack(emptyDoc());

      fetchRiderList();
      setTimeout(() => {
        setShowModal(false);
        setModalMsg(null);
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register rider";
      setModalMsg({ type: "error", text: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveRider = async () => {
    if (!riderToRemove) return;
    setActionLoading(true);
    try {
      await removeRiderFromFleet(riderToRemove._id);
      setRiders((prev) => prev.filter((r) => r._id !== riderToRemove._id));
      setRiderToRemove(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove rider";
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const isRiderAvailable = (r: Rider) =>
    (r.status === "approved" || !r.status) && (r.isAvailable ?? r.availability ?? false);
  const pendingCount = riders.filter((r) => r.status === "pending").length;
  const availableCount = riders.filter(isRiderAvailable).length;
  const busyCount = riders.filter(
    (r) => (r.status === "approved" || !r.status) && !(r.isAvailable ?? r.availability ?? false)
  ).length;

  const filteredRiders = riders.filter((r) => {
    const term = search.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(term) ||
      r.phone.toString().includes(term) ||
      (r.licenseNumber && r.licenseNumber.toLowerCase().includes(term));
    if (!matchesSearch) return false;
    if (filterStatus === "pending") return r.status === "pending";
    if (filterStatus === "available") return isRiderAvailable(r);
    if (filterStatus === "busy")
      return (r.status === "approved" || !r.status) && !(r.isAvailable ?? r.availability ?? false);
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Territory Rider Fleet</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Active delivery riders registered and operating within your pincode zone
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRiderList}
            disabled={loading}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-xs font-semibold"
            title="Refresh fleet"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Fleet
          </button>
          <button
            onClick={() => {
              setShowModal(true);
              setModalMsg(null);
            }}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-teal-700/20"
          >
            <Plus size={15} />
            Onboard Rider
          </button>
        </div>
      </div>

      {/* Roster KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Territory Fleet</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{riders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Bike size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Review</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{pendingCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Available (Active)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{availableCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Busy / On Delivery</p>
            <p className="text-2xl font-bold text-slate-600 mt-0.5">{busyCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
            <Truck size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search riders by name, phone, or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl text-xs font-medium self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              filterStatus === "all"
                ? "bg-teal-700 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Riders ({riders.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              filterStatus === "pending"
                ? "bg-amber-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("available")}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              filterStatus === "available"
                ? "bg-emerald-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setFilterStatus("busy")}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              filterStatus === "busy"
                ? "bg-slate-700 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Busy ({busyCount})
          </button>
        </div>
      </div>

      {/* Fleet Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading rider fleet...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between text-xs">
          <span>{error}</span>
          <button onClick={fetchRiderList} className="font-bold underline">
            Retry
          </button>
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <Bike size={24} />
          </div>
          <h3 className="font-bold text-gray-900">No Riders in Fleet</h3>
          <p className="text-xs text-gray-500 mt-1">
            {search || filterAvailability !== "all"
              ? "No riders match your search criteria."
              : "Onboard riders to your territory fleet to dispatch orders."}
          </p>
          <button
            onClick={() => {
              setShowModal(true);
              setModalMsg(null);
            }}
            className="mt-4 inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Plus size={14} />
            Onboard First Rider
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Rider Name</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">License / RC</th>
                  <th className="py-3.5 px-6">Vehicle</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRiders.map((rider) => {
                  const available = isRiderAvailable(rider);
                  return (
                    <tr key={rider._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                            <Bike size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{rider.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">ID: {rider._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-700 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-400" />
                          {rider.phone}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-600 font-mono">
                        <div>
                          <span className="text-gray-900 font-semibold">{rider.licenseNumber || "---"}</span>
                          {rider.rcNumber && (
                            <p className="text-[11px] text-gray-400">RC: {rider.rcNumber}</p>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-600 capitalize">
                        {rider.vehicleType || "Two-Wheeler"}
                      </td>

                        {rider.status === "pending" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <Clock size={12} className="text-amber-600" />
                            Pending Verification
                          </span>
                        ) : rider.status === "rejected" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Rejected
                          </span>
                        ) : available ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Busy
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setRiderToRemove(rider)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Unlink from fleet"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onboard Rider Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Bike size={19} className="text-teal-600" />
                Add Delivery Partner to Fleet
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setModalMsg(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 mt-3 flex-shrink-0">
              <button
                onClick={() => {
                  setModalTab("link");
                  setModalMsg(null);
                }}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  modalTab === "link"
                    ? "border-teal-700 text-teal-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <LinkIcon size={14} />
                Link Existing Rider
              </button>
              <button
                onClick={() => {
                  setModalTab("register");
                  setModalMsg(null);
                }}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  modalTab === "register"
                    ? "border-teal-700 text-teal-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <UserPlus size={14} />
                Register New Rider (Branch App Process)
              </button>
            </div>

            {modalMsg && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 flex-shrink-0 ${
                  modalMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {modalMsg.type === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                )}
                <span>{modalMsg.text}</span>
              </div>
            )}

            {modalTab === "link" ? (
              <form onSubmit={handleLinkSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter the registered mobile number of a delivery rider already on the DoKirana platform to link them to your territory fleet.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Rider Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={linkPhone}
                      onChange={(e) => setLinkPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || linkPhone.length !== 10}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                  >
                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                    {actionLoading ? "Linking..." : "Link to Fleet"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
                {/* Personal & Vehicle Info */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/70 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    1. Personal & Vehicle Information
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit number"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value.replace(/\D/g, "") })}
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs font-mono focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Age *</label>
                      <input
                        type="number"
                        min={18}
                        max={65}
                        required
                        value={regForm.age}
                        onChange={(e) => setRegForm({ ...regForm, age: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Gender *</label>
                      <select
                        value={regForm.gender}
                        onChange={(e) => setRegForm({ ...regForm, gender: e.target.value as "male" | "female" | "other" })}
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Driving License Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TS0920210001234"
                        value={regForm.licenseNumber}
                        onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value.toUpperCase() })}
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs font-mono uppercase focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle RC Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TS09EA1234"
                        value={regForm.rcNumber}
                        onChange={(e) => setRegForm({ ...regForm, rcNumber: e.target.value.toUpperCase() })}
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs font-mono uppercase focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5 Required Documents matching dkbranch app */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      2. KYC Documents (Exact DkBranch Process)
                    </h4>
                    <span className="text-[11px] text-teal-700 font-medium">All 5 documents required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. Rider Photo */}
                    <DocUploadBox
                      label="1. Rider Photo / Selfie *"
                      docType="deliveryPartnerPhoto"
                      docState={docPhoto}
                      onFileSelect={(file) => uploadDoc(file, "deliveryPartnerPhoto", setDocPhoto)}
                    />

                    {/* 2. License Image */}
                    <DocUploadBox
                      label="2. Driving License Photo *"
                      docType="licenseImage"
                      docState={docLicense}
                      onFileSelect={(file) => uploadDoc(file, "licenseImage", setDocLicense)}
                    />

                    {/* 3. RC Image */}
                    <DocUploadBox
                      label="3. Vehicle RC Photo *"
                      docType="rcImage"
                      docState={docRc}
                      onFileSelect={(file) => uploadDoc(file, "rcImage", setDocRc)}
                    />

                    {/* 4. Aadhaar Front */}
                    <DocUploadBox
                      label="4. Aadhaar Card (Front) *"
                      docType="aadhaarFront"
                      docState={docAadhaarFront}
                      onFileSelect={(file) => uploadDoc(file, "aadhaarFront", setDocAadhaarFront)}
                    />

                    {/* 5. Aadhaar Back */}
                    <div className="sm:col-span-2">
                      <DocUploadBox
                        label="5. Aadhaar Card (Back) *"
                        docType="aadhaarBack"
                        docState={docAadhaarBack}
                        onFileSelect={(file) => uploadDoc(file, "aadhaarBack", setDocAadhaarBack)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      actionLoading ||
                      !regForm.name ||
                      regForm.phone.length !== 10 ||
                      !regForm.licenseNumber ||
                      !regForm.rcNumber ||
                      !docPhoto.url ||
                      !docLicense.url ||
                      !docRc.url ||
                      !docAadhaarFront.url ||
                      !docAadhaarBack.url
                    }
                    className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                  >
                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                    {actionLoading ? "Registering..." : "Submit & Complete Onboarding"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Unlink Rider Confirmation Modal */}
      {riderToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Unlink Delivery Partner?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-gray-800">{riderToRemove.name}</strong> from your territory fleet? They will no longer receive orders dispatched from your zone.
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => setRiderToRemove(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveRider}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Unlink Rider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Document Upload Box Component
interface DocBoxProps {
  label: string;
  docType: string;
  docState: DocUploadState;
  onFileSelect: (file: File) => void;
}

const DocUploadBox = ({ label, docType, docState, onFileSelect }: DocBoxProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-700">{label}</label>
        {docState.url && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <CheckCircle2 size={12} />
            Uploaded
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleChange}
      />

      {docState.uploading ? (
        <div className="h-14 rounded-lg bg-gray-50 flex items-center justify-center gap-2 text-xs text-teal-700">
          <Loader2 size={14} className="animate-spin" />
          <span>Uploading to GCP...</span>
        </div>
      ) : docState.url ? (
        <div className="h-14 rounded-lg bg-emerald-50/50 border border-emerald-200 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileCheck size={16} className="text-emerald-600 flex-shrink-0" />
            <span className="text-[11px] font-mono text-emerald-800 truncate">
              {docState.file?.name || `${docType}.jpg`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[11px] text-teal-700 font-semibold hover:underline flex-shrink-0 ml-2"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-14 rounded-lg border border-dashed border-gray-300 hover:border-teal-600 bg-gray-50/50 hover:bg-teal-50/30 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-teal-700 transition-colors"
        >
          <Upload size={14} />
          <span>Select File</span>
        </button>
      )}

      {docState.error && (
        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle size={11} />
          {docState.error}
        </p>
      )}
    </div>
  );
};

export default OperatorRiders;