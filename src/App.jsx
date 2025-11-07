import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import Layout from './components/layout/Layout';
import ClientLayout from './components/layout/ClientLayout';
import { ROLES, ROUTES } from './utils/constants';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ResendEmail from './pages/auth/ResendEmail';
import TwoFactorAuth from './pages/auth/TwoFactorAuth';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import Plans from './pages/admin/Plans';
import AllPins from './pages/admin/pins/AllPins';
import UserPins from './pages/admin/pins/UserPins';
import AdminPins from './pages/admin/pins/AdminPins';
import UsedPins from './pages/admin/pins/UsedPins';
import UnusedPins from './pages/admin/pins/UnusedPins';
import ActiveUsers from './pages/admin/users/ActiveUsers';
import BannedUsers from './pages/admin/users/BannedUsers';
import EmailUnverified from './pages/admin/users/EmailUnverified';
import MobileUnverified from './pages/admin/users/MobileUnverified';
import KYCUnverified from './pages/admin/users/KYCUnverified';
import KYCPending from './pages/admin/users/KYCPending';
import PaidUsers from './pages/admin/users/PaidUsers';
import AllUsers from './pages/admin/users/AllUsers';
import SendNotification from './pages/admin/users/SendNotification';
import PendingDeposits from './pages/admin/deposits/PendingDeposits';
import ApprovedDeposits from './pages/admin/deposits/ApprovedDeposits';
import SuccessfulDeposits from './pages/admin/deposits/SuccessfulDeposits';
import RejectedDeposits from './pages/admin/deposits/RejectedDeposits';
import InitiatedDeposits from './pages/admin/deposits/InitiatedDeposits';
import AllDeposits from './pages/admin/deposits/AllDeposits';
import PendingWithdrawals from './pages/admin/withdrawals/PendingWithdrawals';
import ApprovedWithdrawals from './pages/admin/withdrawals/ApprovedWithdrawals';
import RejectedWithdrawals from './pages/admin/withdrawals/RejectedWithdrawals';
import AllWithdrawals from './pages/admin/withdrawals/AllWithdrawals';
import PendingTicket from './pages/admin/support/PendingTicket';
import ClosedTicket from './pages/admin/support/ClosedTicket';
import AnsweredTicket from './pages/admin/support/AnsweredTicket';
import AllTicket from './pages/admin/support/AllTicket';
import TransactionHistory from './pages/admin/reports/TransactionHistory';
import InvestLog from './pages/admin/reports/InvestLog';
import BVLog from './pages/admin/reports/BVLog';
import ReferralCommission from './pages/admin/reports/ReferralCommission';
import BinaryCommission from './pages/admin/reports/BinaryCommission';
import LoginHistory from './pages/admin/reports/LoginHistory';
import NotificationHistory from './pages/admin/reports/NotificationHistory';
import Subscribers from './pages/admin/Subscribers';
import SystemSetting from './pages/admin/settings/SystemSetting';
import Application from './pages/admin/extra/Application';
import Server from './pages/admin/extra/Server';
import Cache from './pages/admin/extra/Cache';
import Update from './pages/admin/extra/Update';
import ReportRequest from './pages/admin/extra/ReportRequest';
import UserRanking from './pages/admin/ranking/UserRanking';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import ClientPlans from './pages/client/Plans';
import BvLog from './pages/client/BvLog';
import MyReferrals from './pages/client/MyReferrals';
import MyTree from './pages/client/MyTree';
import Deposit from './pages/client/Deposit';
import Withdraw from './pages/client/Withdraw';
import BalanceTransfer from './pages/client/BalanceTransfer';
import EPinRecharge from './pages/client/EPinRecharge';
import Transactions from './pages/client/Transactions';
import Ranking from './pages/client/Ranking';
import ClientSupport from './pages/client/Support';
import TwoFactorAuthClient from './pages/client/TwoFactorAuth';
import Profile from './pages/client/Profile';
import ChangePassword from './pages/client/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={`${ROUTES.RESET_PASSWORD}/:token`} element={<ResetPassword />} />
          <Route path={`${ROUTES.VERIFY_EMAIL}/:token`} element={<VerifyEmail />} />
          <Route path={ROUTES.RESEND_EMAIL} element={<ResendEmail />} />
          <Route path={ROUTES.TWO_FA} element={<TwoFactorAuth />} />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                  <Layout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="plans" element={<Plans />} />
                      <Route path="pins/all" element={<AllPins />} />
                      <Route path="pins/user" element={<UserPins />} />
                      <Route path="pins/admin" element={<AdminPins />} />
                      <Route path="pins/used" element={<UsedPins />} />
                      <Route path="pins/unused" element={<UnusedPins />} />
                      <Route path="users/active" element={<ActiveUsers />} />
                      <Route path="users/banned" element={<BannedUsers />} />
                      <Route path="users/email-unverified" element={<EmailUnverified />} />
                      <Route path="users/mobile-unverified" element={<MobileUnverified />} />
                      <Route path="users/kyc-unverified" element={<KYCUnverified />} />
                      <Route path="users/kyc-pending" element={<KYCPending />} />
                      <Route path="users/paid" element={<PaidUsers />} />
                      <Route path="users/all" element={<AllUsers />} />
                      <Route path="users/send-notification" element={<SendNotification />} />
                      <Route path="deposits/pending" element={<PendingDeposits />} />
                      <Route path="deposits/approved" element={<ApprovedDeposits />} />
                      <Route path="deposits/successful" element={<SuccessfulDeposits />} />
                      <Route path="deposits/rejected" element={<RejectedDeposits />} />
                      <Route path="deposits/initiated" element={<InitiatedDeposits />} />
                      <Route path="deposits/all" element={<AllDeposits />} />
                      <Route path="withdrawals/pending" element={<PendingWithdrawals />} />
                      <Route path="withdrawals/approved" element={<ApprovedWithdrawals />} />
                      <Route path="withdrawals/rejected" element={<RejectedWithdrawals />} />
                      <Route path="withdrawals/all" element={<AllWithdrawals />} />
                      <Route path="support/pending" element={<PendingTicket />} />
                      <Route path="support/closed" element={<ClosedTicket />} />
                      <Route path="support/answered" element={<AnsweredTicket />} />
                      <Route path="support/all" element={<AllTicket />} />
                      <Route path="reports/transaction" element={<TransactionHistory />} />
                      <Route path="reports/invest" element={<InvestLog />} />
                      <Route path="reports/bv" element={<BVLog />} />
                      <Route path="reports/referral" element={<ReferralCommission />} />
                      <Route path="reports/binary" element={<BinaryCommission />} />
                      <Route path="reports/login" element={<LoginHistory />} />
                      <Route path="reports/notification" element={<NotificationHistory />} />
                      <Route path="subscribers" element={<Subscribers />} />
                      <Route path="settings" element={<SystemSetting />} />
                      <Route path="extra/application" element={<Application />} />
                      <Route path="extra/server" element={<Server />} />
                      <Route path="extra/cache" element={<Cache />} />
                      <Route path="extra/update" element={<Update />} />
                      <Route path="extra/report-request" element={<ReportRequest />} />
                      <Route path="ranking" element={<UserRanking />} />
                      <Route path="*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
                    </Routes>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Client routes */}
          <Route
            path="/client/*"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={[ROLES.CLIENT]}>
                  <ClientLayout>
                    <Routes>
                      <Route path="dashboard" element={<ClientDashboard />} />
                      <Route path="plans" element={<ClientPlans />} />
                      <Route path="bv-log" element={<BvLog />} />
                      <Route path="my-referrals" element={<MyReferrals />} />
                      <Route path="my-tree" element={<MyTree />} />
                      <Route path="deposit" element={<Deposit />} />
                      <Route path="withdraw" element={<Withdraw />} />
                      <Route path="balance-transfer" element={<BalanceTransfer />} />
                      <Route path="epin-recharge" element={<EPinRecharge />} />
                      <Route path="transactions" element={<Transactions />} />
                      <Route path="ranking" element={<Ranking />} />
                      <Route path="support" element={<ClientSupport />} />
                      <Route path="2fa" element={<TwoFactorAuthClient />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="change-password" element={<ChangePassword />} />
                      <Route path="*" element={<Navigate to={ROUTES.CLIENT_DASHBOARD} replace />} />
                    </Routes>
                  </ClientLayout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
