import ModulePage from "../../components/ModulePage";
export default function MaterialIssues() {
    return <ModulePage title="Material Issues" subtitle="Track raw material issuances to production floor" columns={["Issue No", "Date", "Routecard", "Issued To", "Items"]} addLabel="New Issue" />;
}
