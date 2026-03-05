import ModulePage from "../../components/ModulePage";
export default function Quotations() {
    return <ModulePage title="Quotations" subtitle="Create and send quotations to customers" columns={["Quote ID", "Inquiry Ref", "Customer", "Valid Until", "Total", "Status"]} statusField="Status" addLabel="New Quotation" />;
}
