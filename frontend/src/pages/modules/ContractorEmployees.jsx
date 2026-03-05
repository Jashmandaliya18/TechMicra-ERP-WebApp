import ModulePage from "../../components/ModulePage";
export default function ContractorEmployees() {
    return <ModulePage title="Contractor Staff" subtitle="Manage contractor / agency labor" columns={["Code", "Name", "Company", "Department", "Daily Wage", "Status"]} statusField="Status" addLabel="New Contractor Staff" />;
}
