import ProtectedRoute from "./_components/Common/ProtectedRoute";
import Dashboard from "./_components/Dashboard/Dashboard";
import Header from "./_layout/Header";

export default function Home() {
  return (
    <ProtectedRoute>
      <Header />
      <Dashboard />
    </ProtectedRoute>
  );
};

