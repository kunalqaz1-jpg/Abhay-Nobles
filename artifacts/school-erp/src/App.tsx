import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SchoolWebsite from "@/pages/SchoolWebsite";
import StudentPortal from "@/pages/StudentPortal";
import HomePage from "@/pages/HomePage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import TeacherLoginPage from "@/pages/TeacherLoginPage";
import AdminPrincipalDashboard from "@/pages/AdminPrincipalDashboard";
import TeacherDashboardClient from "@/pages/TeacherDashboardClient";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060b1f", color: "#eef2ff" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404 — Page Not Found</h1>
        <a href="/" style={{ color: "#67e8f9" }}>Go back home</a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SchoolWebsite} />
      <Route path="/student/login" component={StudentPortal} />
      <Route path="/erp" component={HomePage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminPrincipalDashboard} />
      <Route path="/teacher/login" component={TeacherLoginPage} />
      <Route path="/teacher/dashboard" component={TeacherDashboardClient} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
