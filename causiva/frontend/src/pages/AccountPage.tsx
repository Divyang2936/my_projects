import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../router/RouterContext";
import { MapPin, LogOut, Pencil, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api, ApiAddress, ApiOrder } from "../lib/api";

type Address = {
  name: string;
  address: string;
  city: string;
  phone: string;
};

const primaryAddress: Address = {
  name: "Priya Sharma",
  address: "Flat 402, Green Meadows Residency, Koramangala 4th Block",
  city: "Bengaluru, Karnataka 560034",
  phone: "+91 98765 43210",
};

export const AccountPage: React.FC = () => {
  const { navigate } = useRouter();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const [addressMode, setAddressMode] = useState<"view" | "edit" | "add">("view");
  const [currentAddress, setCurrentAddress] = useState<Address>(primaryAddress);
  const [additionalAddress, setAdditionalAddress] = useState<Address | null>(null);
  const [draftAddress, setDraftAddress] = useState<Address>(primaryAddress);

  useEffect(() => {
    Promise.all([api.orders(), api.addresses()])
      .then(([loadedOrders, loadedAddresses]) => { setOrders(loadedOrders); setAddresses(loadedAddresses); })
      .catch((error: Error) => setLoadError(error.message));
  }, []);

  const openAddressForm = (mode: "edit" | "add") => {
    setDraftAddress(mode === "edit" ? currentAddress : { name: "", address: "", city: "", phone: "" });
    setAddressMode(mode);
  };

  const handleAddressSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (addressMode === "edit") setCurrentAddress(draftAddress);
    if (addressMode === "add") {
      const [city = "", state = "", pinCode = ""] = draftAddress.city.split(",").map((part) => part.trim());
      api.addAddress({ name: draftAddress.name, address: draftAddress.address, city, state, pinCode, phone: draftAddress.phone, defaultAddress: false })
        .then((address) => setAddresses((current) => [...current, address]))
        .catch((error: Error) => setLoadError(error.message));
      setAdditionalAddress(draftAddress);
    }
    setAddressMode("view");
  };

  const handleLogout = () => {
    logout().finally(() => navigate("/login"));
  };

  return (
    <div className="pt-0 md:pt-28 pb-20 max-w-4xl mx-auto px-4 md:px-8 space-y-10">
      {/* User Banner */}
      <div className="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            P
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary">{user?.firstName} {user?.lastName}</h1>
            <p className="text-xs text-secondary">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold uppercase bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full">
                Tier: Botanical Patron
              </span>
              <span className="text-xs font-semibold text-primary">{user?.points ?? 0} Sanctuary Points</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-surface-container-lowest hover:text-primary"
          >
            <LogOut size={15} />
            Log out
          </button>
          <button
            onClick={() => navigate("/rewards")}
            className="rounded-full bg-surface-container-lowest px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-surface-variant border border-outline-variant/40"
          >
            View Rewards Club →
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-3 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 -mb-3 transition-colors ${
            activeTab === "orders" ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-primary"
          }`}
        >
          Recent Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`pb-3 -mb-3 transition-colors ${
            activeTab === "addresses" ? "text-primary border-b-2 border-primary" : "text-secondary hover:text-primary"
          }`}
        >
          Saved Sanctum Addresses
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "orders" ? (
        <div className="space-y-4">
          {loadError && <p className="text-xs font-semibold text-red-700">{loadError}</p>}
          {orders.length > 0 && orders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
                <div><span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Order ID</span><p className="font-mono text-xs font-bold text-primary">{order.orderNumber}</p></div>
                <div><span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Status</span><p className="text-xs font-bold text-primary">{order.status}</p></div>
                <button onClick={() => navigate(`/track-order?orderId=${order.orderNumber}`)} className="text-xs font-bold text-primary hover:underline">Live Tracking →</button>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs"><div className="space-y-1">{order.items.map((item) => <p key={`${order.id}-${item.productId}`} className="font-bold text-primary">{item.productName} ({item.volume}) × {item.quantity}</p>)}</div><span className="font-serif text-base font-bold text-primary">₹{order.total}</span></div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-secondary">No orders yet.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {addressMode === "view" ? (
            <>
              {addresses.map((address) => (
                <div key={address.id} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2"><MapPin size={17} className="text-primary" /><h3 className="font-serif text-sm font-bold text-primary">Saved address</h3></div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{address.name}<br />{address.address}<br />{address.city}, {address.state} {address.pinCode}<br />Phone: {address.phone}</p>
                </div>
              ))}
              {addresses.length === 0 && <p className="text-sm text-secondary">No saved addresses yet.</p>}

              <button onClick={() => openAddressForm("add")} className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-on-primary">
                <Plus size={15} /> Add new address
              </button>
            </>
          ) : (
            <form onSubmit={handleAddressSubmit} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-serif text-lg font-bold text-primary">{addressMode === "edit" ? "Edit address" : "Add a new address"}</h3>
                <button type="button" onClick={() => setAddressMode("view")} className="rounded-full p-1.5 text-secondary hover:bg-surface-container-low hover:text-primary" aria-label="Cancel address editing">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                {(["name", "phone", "city"] as const).map((field) => (
                  <label key={field} className={field === "city" ? "sm:col-span-2" : ""}>
                    <span className="mb-1 block text-[11px] font-bold uppercase text-secondary">{field === "name" ? "Full name" : field === "phone" ? "Phone number" : "City, state & PIN"}</span>
                    <input required type={field === "phone" ? "tel" : "text"} value={draftAddress[field]} onChange={(event) => setDraftAddress({ ...draftAddress, [field]: event.target.value })} className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </label>
                ))}
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-secondary">Street address & apartment</span>
                  <input required type="text" value={draftAddress.address} onChange={(event) => setDraftAddress({ ...draftAddress, address: event.target.value })} className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setAddressMode("view")} className="rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary">Cancel</button>
                <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-primary">Save address</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
