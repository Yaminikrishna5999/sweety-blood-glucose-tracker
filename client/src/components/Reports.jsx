
import React, { useEffect, useState } from "react";
import {
  getDailyReport,
  getMonthToDateReport,
  getPreviousMonthReport,
} from "../services/reportService";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const today = getTodayDate();
const currentYear = Number(today.slice(0, 4));
const currentMonth = Number(today.slice(5, 7));
const currentDay = Number(today.slice(8, 10));

function ReportCard({ title, report }) {
  const statistics = report?.statistics;

  return (
    <section className="report-card">
      <h3>{title}</h3>

      {!report ? (
        <p>Loading report...</p>
      ) : (
        <>
          <div className="report-statistics">
            <div className="stat-item">
              <span>Highest</span>
              <strong>
                {statistics.highest !== null
                  ? `${statistics.highest} mg/dL`
                  : "N/A"}
              </strong>
            </div>

            <div className="stat-item">
              <span>Lowest</span>
              <strong>
                {statistics.lowest !== null
                  ? `${statistics.lowest} mg/dL`
                  : "N/A"}
              </strong>
            </div>

            <div className="stat-item">
              <span>Average</span>
              <strong>
                {statistics.average !== null
                  ? `${Number(statistics.average).toFixed(1)} mg/dL`
                  : "N/A"}
              </strong>
            </div>

            <div className="stat-item">
              <span>Total Readings</span>
              <strong>{statistics.count}</strong>
            </div>
          </div>

          <h4>Individual Readings</h4>

          {report.readings.length === 0 ? (
            <p>No glucose readings available for this period.</p>
          ) : (
            <div className="report-readings">
              {report.readings.map((reading) => (
                <div key={reading.id} className="report-reading-item">
                  <p>
                    <strong>Date:</strong> {reading.reading_date}
                  </p>

                  <p>
                    <strong>Slot:</strong> {reading.slot}
                  </p>

                  <p>
                    <strong>Glucose:</strong> {reading.glucose_value} mg/dL
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Reports() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const [dailyReport, setDailyReport] = useState(null);
  const [monthReport, setMonthReport] = useState(null);
  const [previousReport, setPreviousReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, index) => currentYear - index
  );

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  const daysInMonth =
    selectedYear && selectedMonth
      ? new Date(
          Number(selectedYear),
          Number(selectedMonth),
          0
        ).getDate()
      : 0;

  const maxDay =
    Number(selectedYear) === currentYear &&
    Number(selectedMonth) === currentMonth
      ? currentDay
      : daysInMonth;

  const selectedDate =
    selectedYear && selectedMonth && selectedDay
      ? `${selectedYear}-${selectedMonth}-${selectedDay}`
      : "";

  const fetchReports = async (date) => {
    if (!date) return;

    setLoading(true);
    setMessage("");

    try {
      const [daily, month, previous] = await Promise.all([
        getDailyReport(date),
        getMonthToDateReport(date),
        getPreviousMonthReport(date),
      ]);

      setDailyReport(daily);
      setMonthReport(month);
      setPreviousReport(previous);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchReports(selectedDate);
    } else {
      setDailyReport(null);
      setMonthReport(null);
      setPreviousReport(null);
      setMessage("");
    }
  }, [selectedDate]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("");
    setSelectedDay("");
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedDay("");
  };

  const handleRefresh = () => {
    if (selectedDate && !loading) {
      fetchReports(selectedDate);
    }
  };

  return (
    <section className="reports-section">

      <div className="reports-header">
        <h2>Glucose Reports</h2>

        <button
          type="button"
          className="refresh-button"
          onClick={handleRefresh}
          disabled={!selectedDate || loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      <div className="report-date-filter">
        <label>Select Report Date</label>

        <div className="report-date-selectors">
          <select
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="">Select Year</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={!selectedYear}
          >
            <option value="">Select Month</option>

            {months.map((month, index) => {
              const monthNumber = String(index + 1).padStart(2, "0");

              const disabled =
                Number(selectedYear) === currentYear &&
                index + 1 > currentMonth;

              return (
                <option
                  key={monthNumber}
                  value={monthNumber}
                  disabled={disabled}
                >
                  {month}
                </option>
              );
            })}
          </select>

          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            disabled={!selectedYear || !selectedMonth}
          >
            <option value="">Select Date</option>

            {Array.from({ length: maxDay }, (_, index) => {
              const day = String(index + 1).padStart(2, "0");

              return (
                <option key={day} value={day}>
                  {index + 1}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {!selectedDate && (
        <p>
          Please select a year, month, and date to view glucose reports.
        </p>
      )}

      {loading && <p>Loading reports...</p>}

      {message && (
        <p className="report-message">{message}</p>
      )}

      {!loading && !message && selectedDate && (
        <div className="reports-grid">
          <ReportCard
            title="Daily Report"
            report={dailyReport}
          />

          <ReportCard
            title="Month-to-Date Report"
            report={monthReport}
          />

          <ReportCard
            title="Previous Month Report"
            report={previousReport}
          />
        </div>
      )}

    </section>
  );
}

export default Reports;
