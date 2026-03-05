import ModulePage from "../../components/ModulePage";
export default function GstAdjustments() {
    return <ModulePage title="GST Adjustments" subtitle="Manage IGST, CGST, SGST adjustments and input tax credit" columns={["Period", "Tax Type", "Output Tax", "Input Credit", "Net Payable", "Status"]} statusField="Status" addLabel="New Adjustment" />;
}
