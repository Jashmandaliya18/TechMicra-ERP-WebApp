import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";
import UserManagement from "../pages/UserManagement";
import RoleManagement from "../pages/RoleManagement";

// Sales
import SalesInquiries from "../pages/modules/SalesInquiries";
import Quotations from "../pages/modules/Quotations";
import SaleOrders from "../pages/modules/SaleOrders";
import Invoices from "../pages/modules/Invoices";
import CustomerMaster from "../pages/modules/CustomerMaster";
import ProductMaster from "../pages/modules/ProductMaster";
import DispatchAdvicePage from "../pages/modules/DispatchAdvice";
import VoucherReceipts from "../pages/modules/Vouchers";

// Purchase Module
import PurchaseLayout from "../components/PurchaseLayout";
import PurchaseDashboard from "../pages/purchase/PurchaseDashboard";
import MaterialIndentsPage from "../pages/purchase/MaterialIndents";
import MaterialIndentForm from "../pages/purchase/MaterialIndentForm";
import MaterialIndentView from "../pages/purchase/MaterialIndentView";
import PurchaseOrdersPage from "../pages/purchase/PurchaseOrders";
import PurchaseOrderForm from "../pages/purchase/PurchaseOrderForm";
import PurchaseOrderView from "../pages/purchase/PurchaseOrderView";
import PurchaseSchedulePage from "../pages/purchase/PurchaseSchedule";
import GoodsReceiptNotesPage from "../pages/purchase/GoodsReceiptNotes";
import GRNForm from "../pages/purchase/GRNForm";
import IQCPage from "../pages/purchase/IQC";
import MaterialReceiptsPage from "../pages/purchase/MaterialReceipts";
import PurchaseBillbookPage from "../pages/purchase/PurchaseBillbook";
import VoucherPaymentsPage from "../pages/purchase/VoucherPayments";

// Production
import ProductionBom from "../pages/modules/ProductionBom";
import Routecards from "../pages/modules/Routecards";
import MaterialIssues from "../pages/modules/MaterialIssues";
import MtaPage from "../pages/modules/MtaPage";
import DailyReports from "../pages/modules/DailyReports";
import JobOrders from "../pages/modules/JobOrders";
import ExternalGrn from "../pages/modules/ExternalGrn";
import JobWorkBills from "../pages/modules/JobWorkBills";

// Logistics
import Transporters from "../pages/modules/Transporters";
import LogisticsBookings from "../pages/modules/LogisticsBookings";
import DeliveryChallans from "../pages/modules/DeliveryChallans";
import FreightBillbooks from "../pages/modules/FreightBillbooks";

// Quality
import QualityInspections from "../pages/modules/QualityInspections";
import QualityMTS from "../pages/modules/QualityMTS";
import ProcessQC from "../pages/modules/ProcessQC";
import PreDispatchInspection from "../pages/modules/PreDispatchInspection";
import QualityRejections from "../pages/modules/QualityRejections";

// Maintenance
import ToolMaster from "../pages/modules/ToolMaster";
import MaintenanceSchedule from "../pages/modules/MaintenanceSchedule";
import CalibrationReports from "../pages/modules/CalibrationReports";
import ToolRepairs from "../pages/modules/ToolRepairs";

// Finance
import JournalVoucherPage from "../pages/modules/JournalVoucherPage";
import PaymentReceiptPage from "../pages/modules/PaymentReceiptPage";
import ContraVoucherPage from "../pages/modules/ContraVoucherPage";
import GstJournalPage from "../pages/modules/GstJournalPage";
import BankRecPage from "../pages/modules/BankRecPage";
import CreditCardStatementPage from "../pages/modules/CreditCardStatementPage";

// HR
import Employees from "../pages/modules/hr/Employees";
import SalaryHeads from "../pages/modules/hr/SalaryHeads";
import SalaryStructures from "../pages/modules/hr/SalaryStructures";
import Payroll from "../pages/modules/hr/Payroll";
import EmployeeAdvances from "../pages/modules/hr/EmployeeAdvances";

// Contractors
import ContractorStaff from "../pages/contractors/ContractorStaff";
import SalaryHeadMaster from "../pages/contractors/SalaryHeadMaster";
import ContractorSalaryStructure from "../pages/contractors/SalaryStructure";
import SalarySheet from "../pages/contractors/SalarySheet";
import AdvanceMemo from "../pages/contractors/AdvanceMemo";
import VoucherPayment from "../pages/contractors/VoucherPayment";

// Stores
import Warehouses from "../pages/modules/Warehouses";
import WarehouseOpenings from "../pages/modules/WarehouseOpenings";
import DispatchSRV from "../pages/modules/DispatchSRV";
import WarehouseTransfers from "../pages/modules/WarehouseTransfers";
import WarehouseReceipts from "../pages/modules/WarehouseReceipts";

// Assets
import AssetRegister from "../pages/modules/AssetRegister";
import AssetAllocations from "../pages/modules/AssetAllocations";
import AssetSales from "../pages/modules/AssetSales";
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
                    <Route element={<ProtectedRoute requiredPermission="Sales.view" />}>
                        <Route path="/sales/customers" element={<CustomerMaster />} />
                        <Route path="/sales/products" element={<ProductMaster />} />
                        <Route path="/sales/inquiries" element={<SalesInquiries />} />
                        <Route path="/sales/quotations" element={<Quotations />} />
                        <Route path="/sales/orders" element={<SaleOrders />} />
                        <Route path="/sales/dispatch" element={<DispatchAdvicePage />} />
                        <Route path="/sales/invoices" element={<Invoices />} />
                        <Route path="/sales/receipts" element={<VoucherReceipts />} />
                    </Route>

                    {/* Purchase Module */}
                    <Route element={<ProtectedRoute requiredPermission="Purchase.view" />}>
                        <Route path="/purchase/dashboard" element={<PurchaseDashboard />} />
                        <Route path="/purchase/material-indents" element={<MaterialIndentsPage />} />
                        <Route path="/purchase/material-indents/new" element={<MaterialIndentForm />} />
                        <Route path="/purchase/material-indents/:id" element={<MaterialIndentView />} />
                        <Route path="/purchase/material-indents/edit/:id" element={<MaterialIndentForm />} />
                        <Route path="/purchase/orders" element={<PurchaseOrdersPage />} />
                        <Route path="/purchase/orders/new" element={<PurchaseOrderForm />} />
                        <Route path="/purchase/orders/:id" element={<PurchaseOrderView />} />
                        <Route path="/purchase/orders/edit/:id" element={<PurchaseOrderForm />} />
                        <Route path="/purchase/schedules" element={<PurchaseSchedulePage />} />
                        <Route path="/purchase/grn" element={<GoodsReceiptNotesPage />} />
                        <Route path="/purchase/grn/new" element={<GRNForm />} />
                        <Route path="/purchase/iqc" element={<IQCPage />} />
                        <Route path="/purchase/receipts" element={<MaterialReceiptsPage />} />
                        <Route path="/purchase/billbook" element={<PurchaseBillbookPage />} />
                        <Route path="/purchase/payments" element={<VoucherPaymentsPage />} />
                    </Route>

                    {/* Production */}
                    <Route element={<ProtectedRoute requiredPermission="Production.view" />}>
                        <Route path="/production/bom" element={<ProductionBom />} />
                        <Route path="/production/routecards" element={<Routecards />} />
                        <Route path="/production/material-issues" element={<MaterialIssues />} />
                        <Route path="/production/mta" element={<MtaPage />} />
                        <Route path="/production/reports" element={<DailyReports />} />
                        <Route path="/production/job-orders" element={<JobOrders />} />
                        <Route path="/production/external-grn" element={<ExternalGrn />} />
                        <Route path="/production/job-bills" element={<JobWorkBills />} />
                    </Route>

                    {/* Logistics */}
                    <Route element={<ProtectedRoute requiredPermission="Logistics.view" />}>
                        <Route path="/logistics/transporters" element={<Transporters />} />
                        <Route path="/logistics/bookings" element={<LogisticsBookings />} />
                        <Route path="/logistics/challans" element={<DeliveryChallans />} />
                        <Route path="/logistics/freight" element={<FreightBillbooks />} />
                    </Route>

                    {/* Quality */}
                    <Route element={<ProtectedRoute requiredPermission="Quality.view" />}>
                        <Route path="/quality/inspections" element={<QualityInspections />} />
                        <Route path="/quality/mts" element={<QualityMTS />} />
                        <Route path="/quality/pqc" element={<ProcessQC />} />
                        <Route path="/quality/pdi" element={<PreDispatchInspection />} />
                        <Route path="/quality/rejections" element={<QualityRejections />} />
                    </Route>

                    {/* Maintenance */}
                    <Route element={<ProtectedRoute requiredPermission="Maintenance.view" />}>
                        <Route path="/maintenance/tools" element={<ToolMaster />} />
                        <Route path="/maintenance/chart" element={<MaintenanceSchedule />} />
                        <Route path="/maintenance/calibration" element={<CalibrationReports />} />
                        <Route path="/maintenance/repairs" element={<ToolRepairs />} />
                    </Route>

                    {/* Finance */}
                    <Route element={<ProtectedRoute requiredPermission="Finance.view" />}>
                        <Route path="/finance/journal" element={<JournalVoucherPage />} />
                        <Route path="/finance/vouchers" element={<PaymentReceiptPage />} />
                        <Route path="/finance/contra" element={<ContraVoucherPage />} />
                        <Route path="/finance/gst" element={<GstJournalPage />} />
                        <Route path="/finance/bank-rec" element={<BankRecPage />} />
                        <Route path="/finance/credit-card" element={<CreditCardStatementPage />} />
                    </Route>

                    {/* HR */}
                    <Route element={<ProtectedRoute requiredPermission="HR.view" />}>
                        <Route path="/hr/employees" element={<Employees />} />
                        <Route path="/hr/salary-heads" element={<SalaryHeads />} />
                        <Route path="/hr/salary" element={<SalaryStructures />} />
                        <Route path="/hr/sheets" element={<Payroll />} />
                        <Route path="/hr/advances" element={<EmployeeAdvances />} />
                    </Route>

                    {/* Contractors */}
                    <Route element={<ProtectedRoute requiredPermission="Contractors.view" />}>
                        <Route path="/contractors/employees" element={<ContractorStaff />} />
                        <Route path="/contractors/salary-heads" element={<SalaryHeadMaster />} />
                        <Route path="/contractors/salary-structure" element={<ContractorSalaryStructure />} />
                        <Route path="/contractors/salary-sheets" element={<SalarySheet />} />
                        <Route path="/contractors/advances" element={<AdvanceMemo />} />
                        <Route path="/contractors/vouchers" element={<VoucherPayment />} />
                    </Route>

                    {/* Stores */}
                    <Route element={<ProtectedRoute requiredPermission="Stores.view" />}>
                        <Route path="/stores/warehouses" element={<Warehouses />} />
                        <Route path="/stores/openings" element={<WarehouseOpenings />} />
                        <Route path="/stores/dispatch" element={<DispatchSRV />} />
                        <Route path="/stores/transfers" element={<WarehouseTransfers />} />
                        <Route path="/stores/receipts" element={<WarehouseReceipts />} />
                    </Route>

                    {/* Assets */}
                    <Route element={<ProtectedRoute requiredPermission="Assets.view" />}>
                        <Route path="/assets/register" element={<AssetRegister />} />
                        <Route path="/assets/allocations" element={<AssetAllocations />} />
                        <Route path="/assets/sales" element={<AssetSales />} />
                        <Route path="/assets/depreciation" element={<AssetDepreciation />} />
                    </Route>

                    {/* Admin Management */}
                    <Route element={<ProtectedRoute requiredPermission="User Management.view" />}>
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/roles" element={<RoleManagement />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
