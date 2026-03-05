import ModulePage from "../../components/ModulePage";
export default function QualityRejections() {
    return <ModulePage title="Rejection & Disposal" subtitle="Track rejected material and disposal actions" columns={["QRD No", "Product", "Rejected Qty", "Source", "Disposal Action", "Date"]} addLabel="New QRD" />;
}
