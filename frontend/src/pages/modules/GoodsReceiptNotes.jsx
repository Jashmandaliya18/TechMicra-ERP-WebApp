import ModulePage from "../../components/ModulePage";
export default function GoodsReceiptNotes() {
    return <ModulePage title="Goods Receipt Notes" subtitle="Record incoming materials from vendors" columns={["GRN No", "PO Ref", "Vendor", "Receipt Date", "Status"]} statusField="Status" addLabel="New GRN" />;
}
