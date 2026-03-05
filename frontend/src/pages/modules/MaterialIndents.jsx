import ModulePage from "../../components/ModulePage";
export default function MaterialIndents() {
    return <ModulePage title="Material Indents" subtitle="Raise purchase requisitions from production or stores" columns={["Indent No", "Date", "Raised By", "Department", "Status"]} statusField="Status" addLabel="New Indent" />;
}
