
import React, { useEffect, useState } from "react";
import {
    getReadings,
    addReading,
    updateReading,
    deleteReading,
} from "../services/readingService";

import Reports from "./Reports";

function Dashboard({ onLogout }) {
    const [readings, setReadings] = useState([]);
    const [readingDate, setReadingDate] = useState("");
    const [slot, setSlot] = useState("");
    const [glucoseValue, setGlucoseValue] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Automatically hide messages after 10 seconds
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
        }, 10000);

        return () => clearTimeout(timer);
    }, [message]);

    // Fetch all readings
    const fetchReadings = async () => {
        try {
            const data = await getReadings();
            setReadings(data.readings || []);
        } catch (error) {
            setMessage(error.message);
        }
    };

    useEffect(() => {
        fetchReadings();
    }, []);

    // Add or update a glucose reading
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const readingData = {
            readingDate,
            slot,
            glucoseValue: Number(glucoseValue),
        };

        try {
            if (editingId !== null) {
                await updateReading(editingId, readingData);
                setMessage("Reading updated successfully!");
            } else {
                await addReading(readingData);
                setMessage("Reading added successfully!");
            }

            resetForm();
            await fetchReadings();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Load selected reading into the form
    const handleEdit = (reading) => {
        setEditingId(reading.id);
        setReadingDate(reading.reading_date);
        setSlot(reading.slot);
        setGlucoseValue(String(reading.glucose_value));
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Reset form
    const resetForm = () => {
        setEditingId(null);
        setReadingDate("");
        setSlot("");
        setGlucoseValue("");
    };

    // Cancel editing
    const handleCancelEdit = () => {
        resetForm();
        setMessage("");
    };

    // Delete a glucose reading
    const handleDelete = async (id) => {
        try {
            setMessage("");
            await deleteReading(id);

            if (editingId === id) {
                resetForm();
            }

            setMessage("Reading deleted successfully!");
            await fetchReadings();
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="dashboard">
            <header className="header">
                <div className="header-title">
                    <h1>Sweety</h1>
                    <p>Blood Glucose Tracker</p>
                </div>

                <button className="logout-button" onClick={onLogout}>
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                <h2>My Glucose Dashboard</h2>

                {/* Add or Edit Reading Form */}
                <section className="reading-form-card">
                    <h3>
                        {editingId !== null
                            ? "Edit Glucose Reading"
                            : "Add Glucose Reading"}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="readingDate">Reading Date</label>
                            <input
                                type="date"
                                id="readingDate"
                                value={readingDate}
                                onChange={(e) => setReadingDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="slot">Reading Slot</label>
                            <select
                                id="slot"
                                value={slot}
                                onChange={(e) => setSlot(e.target.value)}
                                required
                            >
                                <option value="">Select Reading Slot</option>
                                <option value="Morning fasting">Morning fasting</option>
                                <option value="After breakfast">After breakfast</option>
                                <option value="After lunch">After lunch</option>
                                <option value="After dinner">After dinner</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="glucoseValue">
                                Glucose Value (mg/dL)
                            </label>
                            <input
                                type="number"
                                id="glucoseValue"
                                min="40"
                                max="600"
                                step="1"
                                placeholder="Enter Glucose Value"
                                value={glucoseValue}
                                onChange={(e) => setGlucoseValue(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Reading"
                                    : "Add Reading"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>

                    {message && <p>{message}</p>}
                </section>

                {/* Reading List */}
                <section className="readings-section">
                    <h3>My Glucose Readings</h3>

                    {readings.length === 0 ? (
                        <p>No glucose readings available yet.</p>
                    ) : (
                        <div className="readings-list">
                            {readings.map((reading) => (
                                <div className="reading-card" key={reading.id}>
                                    <p>
                                        <strong>Date:</strong> {reading.reading_date}
                                    </p>

                                    <p>
                                        <strong>Slot:</strong> {reading.slot}
                                    </p>

                                    <p>
                                        <strong>Glucose:</strong> {reading.glucose_value} mg/dL
                                    </p>

                                    <div className="reading-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(reading)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(reading.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Reports Section */}
                <Reports />

            </main>
        </div>
    );
}

export default Dashboard;
