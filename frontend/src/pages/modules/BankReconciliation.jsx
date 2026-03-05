import ModulePage from "../../components/ModulePage";
export default function BankReconciliation() {
    return <ModulePage title="Bank Reconciliation" subtitle="Reconcile bank statements with ledger entries" columns={["Account", "Statement Date", "Bank Balance", "Book Balance", "Difference", "Status"]} statusField="Status" addLabel="New Reconciliation" />;
}
