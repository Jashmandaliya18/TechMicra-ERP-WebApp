import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function ToolRepairs() {
    return (
        <MuiCrudPage
            title="Tool Maintenance / Rectification Memo"
            endpoint="/tool-repairs"
            columns={[
                { key: "job_id", label: "Job ID" },
                { key: "tool_id", label: "Tool ID" },
                { key: "issue", label: "Issue" },
                { key: "cost", label: "Cost" }
            ]}
            fields={[
                { name: "job_id", label: "Job ID", type: "text", required: false },
                { name: "tool_id", label: "Tool ID", type: "number" },
                { name: "issue", label: "Issue", type: "text", required: false },
                { name: "spares_used", label: "Spares Used", type: "text", required: false },
                { name: "cost", label: "Cost", type: "number", required: false },
                { name: "technician", label: "Technician", type: "text", required: false },
                { name: "repair_date", label: "Repair Date", type: "date", required: false }
            ]}
        />
    );
}
