import ModulePage from "../../components/ModulePage";
export default function PurchaseBillbooks() {
    return <ModulePage title="Purchase Billbooks" subtitle="Track vendor bills and payment schedules" columns={["Bill No", "Vendor", "Invoice Ref", "Amount", "GST", "Total"]} addLabel="New Bill Entry" />;
}
