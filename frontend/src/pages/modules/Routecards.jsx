import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function Routecards() {
    return (
        <MuiCrudPage
            title="Production Route Cards"
            endpoint="/routecards"
            columns={[
                { key: "route_card_no", label: "Route Card No" },
                { key: "batch_no", label: "Batch No" },
                { key: "product", label: "Product" },
                { key: "status", label: "Status" }
            ]}
            fields={[
                { name: "route_card_no", label: "Route Card No", type: "text" },
                { name: "batch_no", label: "Batch No", type: "text" },
                { name: "product", label: "Product", type: "text" },
                { name: "plan_qty", label: "Plan Quantity", type: "number" },
                { name: "start_date", label: "Start Date", type: "date" },
                { name: "end_date", label: "End Date", type: "date", required: false },
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "planned", label: "Planned" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "completed", label: "Completed" }
                    ]
                }
            ]}
        />
    );
}
