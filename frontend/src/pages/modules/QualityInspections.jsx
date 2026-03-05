import ModulePage from "../../components/ModulePage";
export default function QualityInspections() {
    return <ModulePage title="Incoming Quality Control" subtitle="Inspect and test incoming materials" columns={["Sample No", "Product", "GRN Ref", "Test Type", "Result", "Tested By", "Date"]} statusField="Result" addLabel="New Inspection" />;
}
