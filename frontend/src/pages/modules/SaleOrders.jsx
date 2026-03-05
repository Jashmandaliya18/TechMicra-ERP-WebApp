import ModulePage from "../../components/ModulePage";
export default function SaleOrders() {
    return <ModulePage title="Sale Orders" subtitle="Manage confirmed customer orders" columns={["SO No", "Customer", "PO Ref", "Order Date", "Delivery Date", "Status"]} statusField="Status" addLabel="New Sale Order" />;
}
