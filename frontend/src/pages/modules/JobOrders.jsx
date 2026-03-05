import ModulePage from "../../components/ModulePage";
export default function JobOrders() {
    return <ModulePage title="External Job Orders" subtitle="Manage subcontracting and external processing" columns={["Job Order No", "Date", "Vendor", "Process", "Status"]} statusField="Status" addLabel="New Job Order" />;
}
