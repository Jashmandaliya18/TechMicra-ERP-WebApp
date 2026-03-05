import ModulePage from "../../components/ModulePage";
export default function SalesInquiries() {
    return <ModulePage title="Sales Inquiries" subtitle="Track and manage customer inquiries through the pipeline" columns={["Inquiry No", "Customer", "Date", "Sales Person", "Status"]} statusField="Status" addLabel="New Inquiry" />;
}
