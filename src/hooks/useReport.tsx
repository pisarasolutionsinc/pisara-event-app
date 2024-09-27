import { useState } from "react";
import { ReportService } from "../services/reportService";
import { Report } from "../model/reportModel"; // Ensure this type matches the structure of your report object

export const useReport = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(true);
  const [errorReport, setErrorReport] = useState<string | null>(null);

  const reportService = new ReportService("report");

  const fetchReports = async () => {
    try {
      const response: Report | undefined = await reportService
        .GETALL()
        .execute();
      if (response) {
        setReport(response);
      } else {
        setReport(report);
      }
    } catch (error) {
      setErrorReport("Error fetching reports");
      console.error(error);
    } finally {
      setLoadingReport(false);
    }
  };

  const updateEventCount = () => {
    setReport((prevReport) => {
      if (prevReport && prevReport.event) {
        const updatedReport = {
          ...prevReport,
          event: {
            ...prevReport.event,
            totalEvent: (prevReport.event.totalEvent || 0) + 1,
          },
        };
        console.log(updatedReport); // Debug log to check the updated report object
        return updatedReport;
      } else {
        console.warn("Report or report.event is undefined");
        return prevReport; // Return the previous state if `report` or `report.event` is undefined
      }
    });
  };

  return {
    report,
    setReport,
    loadingReport,
    errorReport,
    fetchReports,
    updateEventCount,
  };
};
