import ModulePage from "../../components/ModulePage";
export default function ProductionBom() {
    return <ModulePage title="Bill of Materials" subtitle="Define raw material recipes for finished goods" columns={["Product", "Revision", "Materials Count", "Status"]} statusField="Status" addLabel="New BOM" />;
}
