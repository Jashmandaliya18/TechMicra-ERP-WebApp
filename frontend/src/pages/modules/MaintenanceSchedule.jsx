import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function MaintenanceSchedule() {
    return (
        <MuiCrudPage
            title="Maintenance Chart"
            endpoint="/tool-maintenance"
            columns={[
                { key: "tool_id", label: "Tool ID" },
                { key: "scheduled_date", label: "Scheduled Date" },
                { key: "task_list", label: "Tasks" },
                { key: "status", label: "Status" }
            ]}
            fields={[
                { name: "tool_id", label: "Tool ID", type: "number" },
                { name: "scheduled_date", label: "Scheduled Date", type: "date" },
                { name: "task_list", label: "Task List", type: "text", required: false },
                {
                    name: "status", label: "Status", type: "select",
                    options: [
                        { value: "pending", label: "Pending" },
                        { value: "completed", label: "Completed" }
                    ],
                    required: false
                }
            ]}
        />
    );
}
