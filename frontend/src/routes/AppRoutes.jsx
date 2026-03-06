import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";

// Sales
import SalesInquiries from "../pages/modules/SalesInquiries";
import Quotations from "../pages/modules/Quotations";
import SaleOrders from "../pages/modules/SaleOrders";
import Invoices from "../pages/modules/Invoices";
import CustomerMaster from "../pages/modules/CustomerMaster";
import ProductMaster from "../pages/modules/ProductMaster";
import DispatchAdvicePage from "../pages/modules/DispatchAdvice";
import VoucherReceipts from "../pages/modules/Vouchers";

// Purchase
import MaterialIndents from "../pages/modules/MaterialIndents";
import PurchaseOrders from "../pages/modules/PurchaseOrders";
import GoodsReceiptNotes from "../pages/modules/GoodsReceiptNotes";
import PurchaseBillbooks from "../pages/modules/PurchaseBillbooks";

// Production
import ProductionBom from "../pages/modules/ProductionBom";
import Routecards from "../pages/modules/Routecards";
import MaterialIssues from "../pages/modules/MaterialIssues";
import DailyReports from "../pages/modules/DailyReports";
import JobOrders from "../pages/modules/JobOrders";

// Logistics
import Transporters from "../pages/modules/Transporters";
import LogisticsBookings from "../pages/modules/LogisticsBookings";
import DeliveryChallans from "../pages/modules/DeliveryChallans";
import FreightBillbooks from "../pages/modules/FreightBillbooks";

// Quality
import QualityInspections from "../pages/modules/QualityInspections";
import ProcessQC from "../pages/modules/ProcessQC";
import PreDispatchInspection from "../pages/modules/PreDispatchInspection";
import QualityRejections from "../pages/modules/QualityRejections";

// Maintenance
import ToolMaster from "../pages/modules/ToolMaster";
import MaintenanceChart from "../pages/modules/MaintenanceChart";
import CalibrationRecords from "../pages/modules/CalibrationRecords";

// Finance
import JournalEntries from "../pages/modules/JournalEntries";
import Vouchers from "../pages/modules/Vouchers";
import BankReconciliation from "../pages/modules/BankReconciliation";
import GstAdjustments from "../pages/modules/GstAdjustments";

// HR
import Employees from "../pages/modules/Employees";
import SalaryStructure from "../pages/modules/SalaryStructure";
import MonthlySalarySheets from "../pages/modules/MonthlySalarySheets";
import AdvancesLoans from "../pages/modules/AdvancesLoans";

// Contractors
import ContractorEmployees from "../pages/modules/ContractorEmployees";
import ContractorSalary from "../pages/modules/ContractorSalary";

// Stores
import StoresInventory from "../pages/modules/StoresInventory";
import StoreTransfers from "../pages/modules/StoreTransfers";
import StoreReceipts from "../pages/modules/StoreReceipts";

// Assets
import AssetRegister from "../pages/modules/AssetRegister";
import AssetAllocations from "../pages/modules/AssetAllocations";
import AssetDepreciation from "../pages/modules/AssetDepreciation";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes inside DashboardLayout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />

                    {/* Sales */}
                    <Route path="/sales/customers" element={<CustomerMaster />} />
                    <Route path="/sales/products" element={<ProductMaster />} />
                    <Route path="/sales/inquiries" element={<SalesInquiries />} />
                    <Route path="/sales/quotations" element={<Quotations />} />
                    <Route path="/sales/orders" element={<SaleOrders />} />
                    <Route path="/sales/dispatch" element={<DispatchAdvicePage />} />
                    <Route path="/sales/invoices" element={<Invoices />} />
                    <Route path="/sales/receipts" element={<VoucherReceipts />} />

                    {/* Purchase */}
                    <Route path="/purchase/indents" element={<MaterialIndents />} />
                    <Route path="/purchase/orders" element={<PurchaseOrders />} />
                    <Route path="/purchase/grn" element={<GoodsReceiptNotes />} />
                    <Route path="/purchase/billbooks" element={<PurchaseBillbooks />} />

                    {/* Production */}
                    <Route path="/production/bom" element={<ProductionBom />} />
                    <Route path="/production/routecards" element={<Routecards />} />
                    <Route path="/production/material-issues" element={<MaterialIssues />} />
                    <Route path="/production/reports" element={<DailyReports />} />
                    <Route path="/production/job-orders" element={<JobOrders />} />

                    {/* Logistics */}
                    <Route path="/logistics/transporters" element={<Transporters />} />
                    <Route path="/logistics/bookings" element={<LogisticsBookings />} />
                    <Route path="/logistics/challans" element={<DeliveryChallans />} />
                    <Route path="/logistics/freight" element={<FreightBillbooks />} />

                    {/* Quality */}
                    <Route path="/quality/inspections" element={<QualityInspections />} />
                    <Route path="/quality/pqc" element={<ProcessQC />} />
                    <Route path="/quality/pdi" element={<PreDispatchInspection />} />
                    <Route path="/quality/rejections" element={<QualityRejections />} />

                    {/* Maintenance */}
                    <Route path="/maintenance/tools" element={<ToolMaster />} />
                    <Route path="/maintenance/chart" element={<MaintenanceChart />} />
                    <Route path="/maintenance/calibration" element={<CalibrationRecords />} />

                    {/* Finance */}
                    <Route path="/finance/journal" element={<JournalEntries />} />
                    <Route path="/finance/vouchers" element={<Vouchers />} />
                    <Route path="/finance/bank-rec" element={<BankReconciliation />} />
                    <Route path="/finance/gst" element={<GstAdjustments />} />

                    {/* HR */}
                    <Route path="/hr/employees" element={<Employees />} />
                    <Route path="/hr/salary" element={<SalaryStructure />} />
                    <Route path="/hr/sheets" element={<MonthlySalarySheets />} />
                    <Route path="/hr/advances" element={<AdvancesLoans />} />

                    {/* Contractors */}
                    <Route path="/contractors/employees" element={<ContractorEmployees />} />
                    <Route path="/contractors/salary" element={<ContractorSalary />} />

                    {/* Stores */}
                    <Route path="/stores/inventory" element={<StoresInventory />} />
                    <Route path="/stores/transfers" element={<StoreTransfers />} />
                    <Route path="/stores/receipts" element={<StoreReceipts />} />

                    {/* Assets */}
                    <Route path="/assets/register" element={<AssetRegister />} />
                    <Route path="/assets/allocations" element={<AssetAllocations />} />
                    <Route path="/assets/depreciation" element={<AssetDepreciation />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
