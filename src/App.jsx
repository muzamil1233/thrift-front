
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./component/Login";
import Signup from "./component/Signup";
import Dashboard from "./component/Dashboard/Dashboard";
import CategoryClothes from "./component/Section/CategoryClothes";
import MainLayout from "./component/Sidebar/MainLayout";
import Admin from "./component/Admin";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
import DetailProf from "./component/DetailedProfile/DetailProf";
import Payment from "./component/Payment/Payment";
import { useEffect } from "react";
import { useState } from "react";
import UserProfile from "./component/UserProfile/UserProfile";

// 🔐 User Protected Route (ONLY for payment or sensitive pages)
const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

// 🔐 Admin Protected Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
  

function App() {
 const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const wakeServer = async () => {
      try {
        await fetch('https://thrift-hub.onrender.com/');
        console.log('✅ Server awake');
      } catch (e) {
        console.log('⚠️ Server might be slow');
      } finally {
        setServerReady(true); // render app either way
      }
    };
    wakeServer();
  }, []);

  if (!serverReady) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '16px',
      color: 'gray'
    }}>
      Loading...
    </div>
  );

  return (
    <Router>
      <Routes>

        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
<Route path="/admin/signup" element={<Signup />} />
       <Route
  path="/profile"
  element={
    <UserRoute>
      <UserProfile />
    </UserRoute>
  }
/>


        {/* 🏠 Public Main Pages */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/home"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/category/:category"
          element={
            <MainLayout>
              <CategoryClothes />
            </MainLayout>
          }
        />

        <Route
          path="/detailprof/:id"
          element={<DetailProf />}
        />

        {/* 🔒 Protected User Route (Payment only) */}
        <Route
          path="/payment/:id"
          element={
            <UserRoute>
              <Payment />
            </UserRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <UserRoute>
              <Payment />
            </UserRoute>
          }
        />

        {/* 🔒 Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* ❌ Catch all */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  
  );
}

export default App;

