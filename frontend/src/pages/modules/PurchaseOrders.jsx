import ModulePage from "../../components/ModulePage";
export default function PurchaseOrders() {
    return <ModulePage title="Purchase Orders" subtitle="Create and manage vendor purchase orders" columns={["PO No", "Vendor", "Date", "Delivery Date", "Total", "Status"]} statusField="Status" addLabel="New PO" />;
}
