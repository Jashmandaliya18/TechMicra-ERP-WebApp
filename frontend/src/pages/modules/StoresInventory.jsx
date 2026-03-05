import ModulePage from "../../components/ModulePage";
export default function StoresInventory() {
    return <ModulePage title="Store Inventory" subtitle="View current stock levels across all stores" columns={["Store", "Product", "Opening Qty", "Received", "Dispatched", "Balance"]} addLabel="Opening Balance" />;
}
