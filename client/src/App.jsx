import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import FundWallet from "./pages/FundWallet";
import PaymentSuccess from "./pages/PaymentSuccess";
import Airtime from "./pages/Airtime";
import Data from "./pages/Data";
import Electricity from "./pages/Electricity";
import Cable from "./pages/Cable";
import Transactions from "./pages/Transactions";
import Receipt from "./pages/Receipt";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminTransactions from "./pages/AdminTransactions";
import AdminTransactionDetails from "./pages/AdminTransactionDetails";
import AdminWallet from "./pages/AdminWallet";
import AdminSettings from "./pages/AdminSettings";
import FloatingSupport from "./components/FloatingSupport";
import AdminWalletHistory from "./pages/AdminWalletHistory";
import AdminRefunds from "./pages/AdminRefunds";
import RefundRequest from "./pages/RefundRequest";
function App() {

   return (
    <>
        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/wallet"
                element={
                    <ProtectedRoute>
                        <Wallet />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/fund-wallet"
                element={
                    <ProtectedRoute>
                        <FundWallet />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payment/success"
                element={<PaymentSuccess />}
            />

            <Route
                path="/airtime"
                element={
                    <ProtectedRoute>
                        <Airtime />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/data"
                element={
                    <ProtectedRoute>
                        <Data />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/electricity"
                element={
                    <ProtectedRoute>
                        <Electricity />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/cable"
                element={
                    <ProtectedRoute>
                        <Cable />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <Transactions />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/receipt/:id"
                element={
                    <ProtectedRoute>
                        <Receipt />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/support"
                element={
                    <ProtectedRoute>
                        <Support />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute>
                        <AdminUsers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/transactions"
                element={
                    <ProtectedRoute>
                        <AdminTransactions />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/transactions/:id"
                element={
                    <ProtectedRoute>
                        <AdminTransactionDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/wallet"
                element={
                    <ProtectedRoute>
                        <AdminWallet />
                    </ProtectedRoute>
                }
            />

           <Route
    path="/admin/settings"
    element={
        <ProtectedRoute>
            <AdminSettings />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/wallet/history"
    element={
        <ProtectedRoute>
            <AdminWalletHistory />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/refunds"
    element={<AdminRefunds />}
/>
<Route
    path="/refund/:id"
    element={<RefundRequest />}
/>

        </Routes>

        <FloatingSupport />

    </>
);
}

export default App;