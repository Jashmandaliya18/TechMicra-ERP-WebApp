import ModulePage from "../../components/ModulePage";
export default function Routecards() {
    return <ModulePage title="Routecards" subtitle="Define manufacturing process sequences" columns={["Routecard No", "Product", "BOM Ref", "Batch Size", "Operations"]} addLabel="New Routecard" />;
}
