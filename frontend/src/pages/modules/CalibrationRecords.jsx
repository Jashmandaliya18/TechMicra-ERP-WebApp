import ModulePage from "../../components/ModulePage";
export default function CalibrationRecords() {
    return <ModulePage title="Calibration Records" subtitle="Track calibration history and upcoming due dates" columns={["Calibration No", "Tool", "Date", "Next Due", "Calibrated By", "Result"]} statusField="Result" addLabel="New Calibration" />;
}
