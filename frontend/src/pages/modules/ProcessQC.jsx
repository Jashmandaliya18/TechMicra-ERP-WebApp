import ModulePage from "../../components/ModulePage";
export default function ProcessQC() {
    return <ModulePage title="Process Quality Control" subtitle="In-process quality checks during manufacturing" columns={["PQC No", "Routecard", "Stage", "Sample Size", "Accepted", "Rejected", "Result"]} statusField="Result" addLabel="New PQC" />;
}
