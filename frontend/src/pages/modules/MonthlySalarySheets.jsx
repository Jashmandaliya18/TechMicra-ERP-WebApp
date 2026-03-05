import ModulePage from "../../components/ModulePage";
export default function MonthlySalarySheets() {
    return <ModulePage title="Monthly Salary Sheets" subtitle="Generate and process monthly payroll" columns={["Employee", "Month", "Year", "Gross", "Deductions", "Net Payable", "Status"]} statusField="Status" addLabel="Generate Sheet" />;
}
