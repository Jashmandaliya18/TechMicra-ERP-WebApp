import ModulePage from "../../components/ModulePage";
export default function Transporters() {
    return <ModulePage title="Transporters" subtitle="Manage transport vendors and vehicle fleet" columns={["Name", "Contact Person", "Phone", "Vehicle Types", "Status"]} statusField="Status" addLabel="New Transporter" />;
}
