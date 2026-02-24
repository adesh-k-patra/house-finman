import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Users } from 'lucide-react'
import { useThemeStore } from '@/store'
import { DashboardLayout } from '@/components/layout'
import { GlobalErrorBoundary } from '@/components/ui/GlobalErrorBoundary'

// Auth Pages
import { LoginPage, ProtectedRoute } from '@/features/auth'

// Feature Pages
import { DashboardPage } from '@/features/dashboard'
import { LeadsPage, LeadDetailPage } from '@/features/leads'
import { PartnersPage, PartnerDetailPage, PartnerOnboardingPage, PartnerContractsPage, PartnerOnboardingDetailPage } from '@/features/partners'
import { VendorsPage, VendorDetailPage, PurchaseOrdersPage, PurchaseOrderDetailPage, VendorInvoicesPage } from '@/features/vendors'
import { CommissionsPage } from '@/features/commissions'
import PropertiesPage from '@/features/properties/PropertiesPage'
import PropertyDetailPage from '@/features/properties/PropertyDetailPage'
import PropertyApprovalsPage from '@/features/properties/PropertyApprovalsPage'
import { MentorsPage, MentorSessionsPage } from '@/features/mentors'
import { FinancePaymentsPage, FinanceBillingPage, FinanceRevenueReportsPage } from '@/features/finance'
import { SupportTicketsPage, TicketDetailPage, KnowledgeBasePage, ConversationHubPage } from '@/features/support'
import { AnalyticsPage, FinanceAnalyticsPage, PerformanceAnalyticsPage } from '@/features/analytics'
import { AdminUsersPage, ProductConfigPage, IntegrationsPage, WorkflowBuilderPage, AuditCompliancePage, SystemSettingsPage } from '@/features/admin'
// import { OpportunitiesPage } from '@/features/opportunities'
import { LoansPage, LoanDetailPage } from '@/features/loans'
import { CampaignsPage, CampaignDetailPage } from '@/features/campaigns'
import { SurveysPage } from '@/features/surveys/SurveysPage'
import { SurveyDetailPage } from '@/features/surveys/SurveyDetailPage'
import { SurveyBuilderPage } from '@/features/surveys/builder/SurveyBuilderPage'
import { EditSurveyPage } from '@/features/surveys/builder/EditSurveyPage'
import { TemplatesPage } from '@/features/surveys/builder/views/TemplatesPage'
import { AudiencePage } from '@/features/surveys/builder/views/AudiencePage'
import { ReportsPage } from '@/features/surveys/builder/views/ReportsPage'
import { IntegrationsPage as SurveyIntegrationsPage } from '@/features/surveys/builder/views/IntegrationsPage'

export default function App() {
  const { isDark } = useThemeStore()

  // Apply dark mode class on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <BrowserRouter>
      <GlobalErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Dashboard Layout Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Sales & Leads */}
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/:id" element={<LeadDetailPage />} />
              <Route path="/loans" element={<LoansPage />} />
              <Route path="/loans/:id" element={<LoanDetailPage />} />
              {/* <Route path="/opportunities" element={<OpportunitiesPage />} /> */}
              <Route path="/campaigns" element={<CampaignsPage />} />

              <Route path="/campaigns/detail" element={<CampaignDetailPage />} />

              {/* Surveys */}
              <Route path="/surveys" element={<SurveysPage />} />
              <Route path="/surveys/create" element={<SurveyBuilderPage />} />
              <Route path="/surveys/:id/edit" element={<EditSurveyPage />} />
              <Route path="/surveys/:id" element={<SurveyDetailPage />} />

              {/* Partners */}
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/partners/:id" element={<PartnerDetailPage />} />
              <Route path="/partners/onboarding" element={<PartnerOnboardingPage />} />
              <Route path="/partners/onboarding/:id" element={<PartnerOnboardingDetailPage />} />
              <Route path="/partners/contracts" element={<PartnerContractsPage />} />
              <Route path="/partners/knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="/commissions" element={<CommissionsPage />} />

              {/* Vendors */}
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/vendors/:id" element={<VendorDetailPage />} />
              <Route path="/vendors/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/vendors/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
              <Route path="/vendors/invoices" element={<VendorInvoicesPage />} />

              {/* Properties */}
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/approvals" element={<PropertyApprovalsPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />

              {/* Mentors */}
              <Route path="/mentors" element={<MentorsPage />} />
              <Route path="/mentors/sessions" element={<MentorSessionsPage />} />

              {/* Finance */}
              <Route path="/finance/payments" element={<FinancePaymentsPage />} />
              <Route path="/finance/billing" element={<FinanceBillingPage />} />
              <Route path="/finance/revenue" element={<FinanceRevenueReportsPage />} />

              {/* Placeholder for Applicants (Sidebar link exists) */}
              <Route path="/applicants" element={
                <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Applicants Module</h2>
                  <p className="text-slate-500 max-w-md mt-2">This module is currently under development. Check back soon for applicant tracking features.</p>
                </div>
              } />

              {/* Missing Sidebar Sections (Premium Placeholders) */}
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/audience" element={<AudiencePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/integrations" element={<SurveyIntegrationsPage />} />

              {/* CX & Support */}
              <Route path="/support/tickets" element={<SupportTicketsPage />} />
              <Route path="/support/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/support/conversations" element={<ConversationHubPage />} />
              <Route path="/support/knowledge-base" element={<KnowledgeBasePage />} />

              {/* Analytics */}
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/analytics/performance" element={<PerformanceAnalyticsPage />} />
              <Route path="/analytics/finance" element={<FinanceAnalyticsPage />} />

              {/* Admin */}
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/config" element={<ProductConfigPage />} />
              <Route path="/admin/workflows" element={<WorkflowBuilderPage />} />
              <Route path="/admin/integrations" element={<IntegrationsPage />} />
              <Route path="/admin/audit" element={<AuditCompliancePage />} />
              <Route path="/admin/settings" element={<SystemSettingsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </GlobalErrorBoundary>
    </BrowserRouter>
  )
}
