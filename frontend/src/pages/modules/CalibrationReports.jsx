import React from "react";
import MuiCrudPage from "../../components/MuiCrudPage";

export default function CalibrationReports() {
    return (
        <MuiCrudPage
            title="Tool Calibration Reports"
            endpoint="/tool-calibration"
            columns={[
                { key: "tool_id", label: "Tool ID" },
                { key: "calibration_date", label: "Calibration Date" },
                { key: "result", label: "Result" },
                { key: "remarks", label: "Remarks" }
            ]}
            fields={[
                { name: "tool_id", label: "Tool ID", type: "number" },
                { name: "calibration_date", label: "Calibration Date", type: "date" },
                { name: "standard_value", label: "Standard Value", type: "text", required: false },
                { name: "actual_value", label: "Actual Value", type: "text", required: false },
                {
                    name: "result", label: "Result", type: "select",
                    options: [
                        { value: "Pass", label: "Pass" },
                        { value: "Fail", label: "Fail" }
                    ],
                    required: false
                },
                { name: "remarks", label: "Remarks", type: "text", required: false }
            ]}
        />
    );
}
