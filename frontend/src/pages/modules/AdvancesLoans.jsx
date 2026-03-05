import ModulePage from "../../components/ModulePage";
export default function AdvancesLoans() {
    return <ModulePage title="Advances & Loans" subtitle="Manage employee advance memos and loan repayments" columns={["Memo No", "Employee", "Date", "Amount", "Installments", "Remaining"]} addLabel="New Advance" />;
}
