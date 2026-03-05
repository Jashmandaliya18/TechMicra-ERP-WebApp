import ModulePage from "../../components/ModulePage";
export default function StoreTransfers() {
    return <ModulePage title="Store Transfers" subtitle="Transfer materials between warehouse locations" columns={["Transfer No", "From Store", "To Store", "Product", "Qty", "Date"]} addLabel="New Transfer" />;
}
