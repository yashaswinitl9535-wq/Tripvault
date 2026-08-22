import { useEffect, useState } from "react";
import api from "./api";

const emptyForm = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
  rating: ""
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tripvault_user")) || null;
    } catch {
      return null;
    }
  });

  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return (
      <Auth
        register={showRegister}
        onToggle={() => setShowRegister((v) => !v)}
        onLogin={(data) => {
          localStorage.setItem("tripvault_token", data.token);
          localStorage.setItem("tripvault_user", JSON.stringify(data.user));
          setUser(data.user);
        }}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        localStorage.removeItem("tripvault_token");
        localStorage.removeItem("tripvault_user");
        setUser(null);
      }}
    />
  );
}

function Auth({ register, onToggle, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = register ? "/auth/register" : "/auth/login";
      const { data } = await api.post(url, form);
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">🗺️ TripVault</div>
        <h1>{register ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {register ? "Start saving your travel memories." : "Sign in to manage your trips."}
        </p>

        <form onSubmit={submit}>
          {register && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              minLength="6"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button disabled={loading}>
            {loading ? "Please wait..." : register ? "Create Account" : "Login"}
          </button>
        </form>

        <button className="link-button" onClick={onToggle}>
          {register ? "Already have an account? Login" : "New here? Create an account"}
        </button>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTrips = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/trips");
      setTrips(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (trip) => {
    setEditingId(trip._id);
    setForm({
      title: trip.title || "",
      destination: trip.destination || "",
      startDate: trip.startDate ? trip.startDate.slice(0, 10) : "",
      endDate: trip.endDate ? trip.endDate.slice(0, 10) : "",
      description: trip.description || "",
      rating: trip.rating || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitTrip = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/trips/${editingId}`, form);
      } else {
        await api.post("/trips", form);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save trip.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await api.delete(`/trips/${id}`);
      await loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete trip.");
    }
  };

  return (
    <div>
      <header className="topbar">
        <div>
          <div className="brand">🗺️ TripVault</div>
          <span className="small">Your personal travel memories</span>
        </div>

        <div className="header-actions">
          <span>Hello, {user.name}</span>
          <button className="secondary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">TRIP DASHBOARD</p>
            <h1>My Trips</h1>
            <p className="muted">Create, edit and organize your travel memories.</p>
          </div>
          <button onClick={openCreate}>+ Create Trip</button>
        </section>

        {showForm && (
          <section className="form-card">
            <h2>{editingId ? "Edit Trip" : "Create Trip"}</h2>

            <form className="trip-form" onSubmit={submitTrip}>
              <label>
                Title *
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="My Goa Trip"
                  required
                />
              </label>

              <label>
                Destination *
                <input
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="Goa, India"
                  required
                />
              </label>

              <div className="two">
                <label>
                  Start Date
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Rating
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                >
                  <option value="">Select rating</option>
                  <option value="1">⭐ 1</option>
                  <option value="2">⭐ 2</option>
                  <option value="3">⭐ 3</option>
                  <option value="4">⭐ 4</option>
                  <option value="5">⭐ 5</option>
                </select>
              </label>

              <label>
                Description
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Write about your trip..."
                />
              </label>

              <div className="form-actions">
                <button type="button" className="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Trip" : "Save Trip"}
                </button>
              </div>
            </form>
          </section>
        )}

        {error && <div className="error page-error">{error}</div>}

        {loading ? (
          <div className="state">Loading your trips...</div>
        ) : trips.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✈️</div>
            <h2>No trips yet</h2>
            <p className="muted">Create your first trip to start your travel diary.</p>
            <button onClick={openCreate}>Create My First Trip</button>
          </div>
        ) : (
          <section className="grid">
            {trips.map((trip) => (
              <article className="trip-card" key={trip._id}>
                <div className="trip-image">🌍</div>
                <div className="trip-content">
                  <div className="card-heading">
                    <div>
                      <h2>{trip.title}</h2>
                      <p className="destination">📍 {trip.destination}</p>
                    </div>
                    {trip.rating && <span className="rating">⭐ {trip.rating}/5</span>}
                  </div>

                  {(trip.startDate || trip.endDate) && (
                    <p className="dates">
                      📅 {formatDate(trip.startDate)} {trip.endDate ? `— ${formatDate(trip.endDate)}` : ""}
                    </p>
                  )}

                  {trip.description && <p className="description">{trip.description}</p>}

                  <div className="card-actions">
                    <button className="secondary" onClick={() => openEdit(trip)}>Edit</button>
                    <button className="danger" onClick={() => deleteTrip(trip._id)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default App;
