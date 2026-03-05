import ModulePage from "../../components/ModulePage";
export default function AssetAllocations() {
    return <ModulePage title="Asset Allocations" subtitle="Track which assets are assigned to employees or departments" columns={["Asset", "Employee", "Department", "Allocated Date", "Returned"]} addLabel="New Allocation" />;
}
