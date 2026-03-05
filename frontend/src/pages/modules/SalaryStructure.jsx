import ModulePage from "../../components/ModulePage";
export default function SalaryStructure() {
    return <ModulePage title="Salary Structure" subtitle="Define earning and deduction heads per employee" columns={["Employee", "Salary Head", "Type", "Amount"]} addLabel="New Structure" />;
}
