import ModulePage from "../../components/ModulePage";
export default function ContractorSalary() {
    return <ModulePage title="Contractor Salary & Payments" subtitle="Process contractor monthly wages and payments" columns={["Employee", "Month", "Year", "Days Worked", "Gross", "Net Payable", "Status"]} statusField="Status" addLabel="Process Salary" />;
}
