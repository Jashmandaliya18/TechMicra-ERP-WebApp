import ModulePage from "../../components/ModulePage";
export default function DeliveryChallans() {
    return <ModulePage title="Delivery Challans" subtitle="Issue goods delivery challans for outward dispatch" columns={["Challan No", "Date", "Booking Ref", "Customer", "Items"]} addLabel="New Challan" />;
}
