import { LoginScreen } from "@/components/erp-ui";

export default function AdminLoginPage() {
  return (
    <LoginScreen
      role="Principal / Admin"
      accent="#67e8f9"
      description="Executive visibility for admissions, academics, staffing, compliance, and financial intelligence."
      dashboardHref="/admin/dashboard"
    />
  );
}
