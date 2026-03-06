import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function JobOrders() {
    return (
        <MuiCrudPage
            title="External Job Orders"
            endpoint="/job-orders"
            columns={[
                { key: "job_order_no", label: "Job Order No" },
                { key: "contractor", label: "Contractor" },
                { key: "item_sent", label: "Item Sent" },
                { key: "rate", label: "Rate" }
            ]}
            fields={[
                { name: "job_order_no", label: "Job Order No", type: "text" },
                { name: "contractor", label: "Contractor", type: "text" },
                { name: "item_sent", label: "Item Sent", type: "text" },
                { name: "process_required", label: "Process Required", type: "text" },
                { name: "rate", label: "Rate", type: "number" }
            ]}
        />
    );
}
