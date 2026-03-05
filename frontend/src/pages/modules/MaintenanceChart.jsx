import ModulePage from "../../components/ModulePage";
export default function MaintenanceChart() {
    return <ModulePage title="Maintenance Chart" subtitle="Schedule and track preventive and corrective maintenance" columns={["Tool", "Type", "Scheduled Date", "Completed", "Work Done", "Status"]} statusField="Status" addLabel="New Schedule" />;
}
