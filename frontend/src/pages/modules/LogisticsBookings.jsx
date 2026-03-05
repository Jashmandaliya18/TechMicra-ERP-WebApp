import ModulePage from "../../components/ModulePage";
export default function LogisticsBookings() {
    return <ModulePage title="Logistics Bookings" subtitle="Book and track outward shipments" columns={["Booking No", "Date", "SO Ref", "Transporter", "Freight", "Status"]} statusField="Status" addLabel="New Booking" />;
}
