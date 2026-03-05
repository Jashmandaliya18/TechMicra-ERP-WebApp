import ModulePage from "../../components/ModulePage";
export default function ToolMaster() {
    return <ModulePage title="Tool Master" subtitle="Manage tools, jigs, fixtures and measuring instruments" columns={["Tool Code", "Name", "Category", "Location", "Next Calibration", "Status"]} statusField="Status" addLabel="New Tool" />;
}
