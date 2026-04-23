import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/baseUrl";
// import { BASE_URL } from "../../api/baseUrl";

const UserProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        const res = await fetch(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          bio: data.bio || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          bio: form.bio,
          dateOfBirth: form.dateOfBirth,
          avatar: form.avatar,
          address: { city: form.city, state: form.state },
        }),
      });
      const data = await res.json();
      setUser(data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  const getMemberDuration = (createdAt) => {
    if (!createdAt) return "";
    const months = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return "New member";
    if (months < 12) return `Member for ${months} month${months > 1 ? "s" : ""}`;
    const years = Math.floor(months / 12);
    return `Member for ${years} year${years > 1 ? "s" : ""}`;
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="loader" />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Syne:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .profile-page {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'Syne', sans-serif;
          color: #fff;
          overflow-x: hidden;
        }

        /* Animated background */
        .bg-orbs {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: drift 12s ease-in-out infinite;
        }
        .orb-1 { width: 500px; height: 500px; background: rgba(120,60,220,0.15); top: -100px; left: -100px; animation-delay: 0s; }
        .orb-2 { width: 400px; height: 400px; background: rgba(220,80,120,0.1); top: 40%; right: -80px; animation-delay: 4s; }
        .orb-3 { width: 300px; height: 300px; background: rgba(60,180,220,0.1); bottom: -50px; left: 30%; animation-delay: 8s; }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }

        .profile-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* Back button */
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          margin-bottom: 40px;
          transition: color 0.2s;
        }
        .back-btn:hover { color: rgba(255,255,255,0.9); }

        /* Hero section */
        .profile-hero {
          display: flex;
          align-items: flex-end;
          gap: 32px;
          margin-bottom: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          animation: fadeUp 0.6s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .avatar-wrap {
          position: relative;
          flex-shrink: 0;
          cursor: pointer;
        }
        .avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255,255,255,0.1);
          display: block;
        }
        .avatar-initials {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #db2777);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          border: 3px solid rgba(255,255,255,0.1);
        }
        .avatar-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          font-size: 11px;
          color: #fff;
          text-align: center;
          font-weight: 500;
        }
        .avatar-wrap:hover .avatar-overlay { opacity: 1; }
        .avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid transparent;
          background: linear-gradient(135deg, #7c3aed, #db2777) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          animation: spin 8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .hero-info { flex: 1; }
        .hero-name {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-email {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 12px;
          letter-spacing: 0.3px;
        }
        .hero-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .badge-member {
          background: rgba(124,58,237,0.2);
          border: 1px solid rgba(124,58,237,0.4);
          color: #a78bfa;
        }
        .badge-location {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          background: rgba(255,255,255,0.04);
          padding: 4px;
          border-radius: 12px;
          width: fit-content;
          animation: fadeUp 0.6s ease 0.1s both;
        }
        .tab {
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          border: none;
          background: none;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .tab.active {
          background: rgba(255,255,255,0.1);
          color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        /* Cards */
        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 20px;
          backdrop-filter: blur(20px);
          animation: fadeUp 0.6s ease 0.2s both;
          transition: border-color 0.2s;
        }
        .glass-card:hover { border-color: rgba(255,255,255,0.12); }

        .card-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }

        .info-field { display: flex; flex-direction: column; gap: 6px; }
        .info-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }
        .info-value {
          font-size: 15px;
          font-weight: 400;
          color: rgba(255,255,255,0.85);
          line-height: 1.5;
        }
        .info-empty { color: rgba(255,255,255,0.25); font-style: italic; font-size: 14px; }

        /* Inputs */
        .edit-input, .edit-textarea {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 11px 14px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .edit-input:focus, .edit-textarea:focus {
          border-color: rgba(124,58,237,0.5);
          background: rgba(255,255,255,0.08);
        }
        .edit-textarea { resize: vertical; min-height: 80px; }
        .edit-input::placeholder, .edit-textarea::placeholder { color: rgba(255,255,255,0.2); }

        /* Bio section */
        .bio-text {
          font-size: 15px;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
        }

        /* Stats row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
          animation: fadeUp 0.6s ease 0.15s both;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.07);
          transform: translateY(-2px);
        }
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Action buttons */
        .actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        .btn-primary {
          padding: 12px 28px;
          background: linear-gradient(135deg, #7c3aed, #db2777);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.1s;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-secondary {
          padding: 12px 28px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: rgba(255,255,255,0.7);
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .btn-danger {
          padding: 12px 28px;
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 10px;
          color: #f87171;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-danger:hover { background: rgba(220,38,38,0.2); }

        .loader {
          width: 36px; height: 36px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #a78bfa;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 28px 0;
        }
      `}</style>

      <div className="profile-page">
        <div className="bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="profile-content">
          {/* Back */}
          <button className="back-btn" onClick={() => navigate("/home")}>
            ← Back to home
          </button>

          {/* Hero */}
          <div className="profile-hero">
            <div className="avatar-wrap" onClick={() => editing && fileInputRef.current?.click()}>
              <div className="avatar-ring" />
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className="avatar" />
                : <div className="avatar-initials">{getInitials(user?.name)}</div>
              }
              {editing && (
                <div className="avatar-overlay">📷<br/>Change</div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setForm(f => ({ ...f, avatar: reader.result }));
                  reader.readAsDataURL(file);
                }
              }}
            />
            <div className="hero-info">
              <h1 className="hero-name">{user?.name}</h1>
              <p className="hero-email">{user?.email}</p>
              <div className="hero-meta">
                <span className="hero-badge badge-member">
                  ✦ {getMemberDuration(user?.createdAt)}
                </span>
                {(user?.address?.city || user?.address?.state) && (
                  <span className="hero-badge badge-location">
                    📍 {[user.address.city, user.address.state].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {["profile", "edit"].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => { setActiveTab(tab); if (tab === "edit") setEditing(true); else setEditing(false); }}
              >
                {tab === "profile" ? "Profile" : "Edit Profile"}
              </button>
            ))}
          </div>

          {activeTab === "profile" && (
            <>
              {/* Bio */}
              {user?.bio && (
                <div className="glass-card">
                  <p className="card-title">About</p>
                  <p className="bio-text">{user.bio}</p>
                </div>
              )}

              {/* Info */}
              <div className="glass-card">
                <p className="card-title">Personal Info</p>
                <div className="info-grid">
                  <div className="info-field">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user?.name || <span className="info-empty">Not set</span>}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{user?.phone || <span className="info-empty">Not set</span>}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">Date of Birth</span>
                    <span className="info-value">{formatDate(user?.dateOfBirth)}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">City</span>
                    <span className="info-value">{user?.address?.city || <span className="info-empty">Not set</span>}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">State</span>
                    <span className="info-value">{user?.address?.state || <span className="info-empty">Not set</span>}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{formatDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "edit" && (
            <div className="glass-card">
              <p className="card-title">Edit Profile</p>
              <div className="info-grid">
                <div className="info-field">
                  <span className="info-label">Full Name</span>
                  <input className="edit-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div className="info-field">
                  <span className="info-label">Phone</span>
                  <input className="edit-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 00000 00000" />
                </div>
                <div className="info-field">
                  <span className="info-label">Date of Birth</span>
                  <input className="edit-input" type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
                </div>
                <div className="info-field">
                  <span className="info-label">City</span>
                  <input className="edit-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Your city" />
                </div>
                <div className="info-field">
                  <span className="info-label">State</span>
                  <input className="edit-input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="Your state" />
                </div>
              </div>

              <div className="divider" />

              <div className="info-field">
                <span className="info-label">Bio</span>
                <textarea
                  className="edit-textarea"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="actions">
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button className="btn-secondary" onClick={() => { setEditing(false); setActiveTab("profile"); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;