import ModulePage from "../../components/ModulePage";
export default function DailyReports() {
    return <ModulePage title="Daily Production Reports" subtitle="Log daily output, scrap, and work center performance" columns={["Date", "Work Center", "Product", "Qty Produced", "Scrap", "Reported By"]} addLabel="New Report" />;
}
