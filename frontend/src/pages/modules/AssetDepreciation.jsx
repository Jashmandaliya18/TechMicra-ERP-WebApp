import ModulePage from "../../components/ModulePage";
export default function AssetDepreciation() {
    return <ModulePage title="Asset Depreciation" subtitle="Calculate and record annual depreciation on assets" columns={["Asset", "Financial Year", "Rate %", "Depreciation", "Written Down Value"]} addLabel="Calculate" />;
}
