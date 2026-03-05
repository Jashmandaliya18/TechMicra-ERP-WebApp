import ModulePage from "../../components/ModulePage";
export default function Invoices() {
    return <ModulePage title="Invoices" subtitle="Generate and track customer invoices" columns={["Invoice No", "Customer", "Date", "Subtotal", "GST", "Total", "Status"]} statusField="Status" addLabel="New Invoice" />;
}
