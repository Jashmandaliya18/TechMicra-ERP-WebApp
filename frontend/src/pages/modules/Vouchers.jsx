import ModulePage from "../../components/ModulePage";
export default function Vouchers() {
    return <ModulePage title="Payment / Receipt Vouchers" subtitle="Record payments and receipts against ledger accounts" columns={["Voucher No", "Type", "Date", "Account", "Amount", "Mode"]} addLabel="New Voucher" />;
}
