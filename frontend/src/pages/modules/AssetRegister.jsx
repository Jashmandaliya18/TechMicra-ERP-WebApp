import ModulePage from "../../components/ModulePage";
export default function AssetRegister() {
    return <ModulePage title="Asset Register" subtitle="Track company assets — equipment, vehicles, furniture" columns={["Code", "Name", "Category", "Purchase Date", "Purchase Value", "Current Value", "Status"]} statusField="Status" addLabel="New Asset" />;
}
