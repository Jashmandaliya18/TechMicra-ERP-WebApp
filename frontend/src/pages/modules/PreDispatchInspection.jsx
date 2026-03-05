import ModulePage from "../../components/ModulePage";
export default function PreDispatchInspection() {
    return <ModulePage title="Pre-Dispatch Inspection" subtitle="Final quality checks before shipping to customer" columns={["PDI No", "SO Ref", "Product", "Inspected", "Passed", "Failed", "Result"]} statusField="Result" addLabel="New PDI" />;
}
