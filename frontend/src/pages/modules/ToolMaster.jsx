import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function ToolMaster() {
    return (
        <MuiCrudPage
            title="Tool Master"
            endpoint="/tools"
            columns={[
                { key: "asset_code", label: "Asset Code" },
                { key: "tool_name", label: "Tool Name" },
                { key: "location", label: "Location" },
                { key: "maintenance_interval_days", label: "Interval (Days)" }
            ]}
            fields={[
                { name: "asset_code", label: "Asset Code", type: "text" },
                { name: "tool_name", label: "Tool Name", type: "text" },
                { name: "location", label: "Location", type: "text", required: false },
                { name: "maintenance_interval_days", label: "Maintenance Interval (Days)", type: "number", required: false }
            ]}
        />
    );
}
