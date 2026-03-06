import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function DeliveryChallans() {
    return (
        <MuiCrudPage
            title="Challan Out (To Contractor)"
            endpoint="/challans"
            columns={[
                { key: "challan_no", label: "Challan No" },
                { key: "job_order_ref", label: "Job Order Ref" },
                { key: "item", label: "Item" },
                { key: "qty", label: "Qty" }
            ]}
            fields={[
                { name: "challan_no", label: "Challan No", type: "text" },
                { name: "job_order_ref", label: "Job Order Reference", type: "text" },
                { name: "item", label: "Item", type: "text" },
                { name: "qty", label: "Quantity", type: "number" },
                { name: "vehicle_no", label: "Vehicle No", type: "text" }
            ]}
        />
    );
}
