import ModulePage from "../../components/ModulePage";
export default function StoreReceipts() {
    return <ModulePage title="Store Receipts" subtitle="Record inward receipts into warehouse" columns={["Receipt No", "Store", "Product", "Qty", "Date", "Received From", "By"]} addLabel="New Receipt" />;
}
