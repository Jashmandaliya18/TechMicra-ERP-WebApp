import ModulePage from "../../components/ModulePage";
export default function JournalEntries() {
    return <ModulePage title="Journal Entries" subtitle="Record double-entry bookkeeping transactions" columns={["Entry No", "Date", "Reference", "Description", "Status"]} statusField="Status" addLabel="New Entry" />;
}
