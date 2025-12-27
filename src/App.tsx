import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PublicGallery from "./pages/PublicGallery";

/* Layout */
import MainLayout from "./layout/MainLayout";

/* Pages */
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import PublicProfile from "./components/PublicProfile";
import AuthPage from "./pages/AuthPage";

/* Page transition */
import PageTransition from "./components/PageTransition";

/* ================= PRIVATE ROUTE ================= */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

/* ================= APP ================= */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTransition>
          <Routes>

            {/* ===== ROUTES WITH NAVBAR ===== */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/profile/:username" element={<PublicProfile />} />
              <Route path="/explore" element={<PublicGallery />} />

            </Route>

            {/* ===== PRIVATE ROUTE ===== */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* ===== FALLBACK ===== */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </PageTransition>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
