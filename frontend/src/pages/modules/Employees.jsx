import ModulePage from "../../components/ModulePage";
export default function Employees() {
    return <ModulePage title="Employees" subtitle="Manage employee master data and records" columns={["Code", "Name", "Department", "Designation", "DOJ", "Basic Salary", "Status"]} statusField="Status" addLabel="New Employee" />;
}
