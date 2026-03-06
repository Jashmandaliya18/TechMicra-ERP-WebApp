import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function DailyReports() {
    return (
        <MuiCrudPage
            title="Production Reports"
            endpoint="/production-reports"
            columns={[
                { key: "date", label: "Date" },
                { key: "shift", label: "Shift" },
                { key: "machine_no", label: "Machine" },
                { key: "production_qty", label: "Produced" }
            ]}
            fields={[
                { name: "date", label: "Date", type: "date" },
                { name: "shift", label: "Shift", type: "text" },
                { name: "machine_no", label: "Machine No", type: "text" },
                { name: "operator", label: "Operator", type: "text" },
                { name: "production_qty", label: "Production Quantity", type: "number" },
                { name: "rejection_qty", label: "Rejection Quantity", type: "number" }
            ]}
        />
    );
}
