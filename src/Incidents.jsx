// src/Incidents.jsx

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBug,
  FaSearch,
  FaSyncAlt,
  FaUserShield,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardList,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Pagination from "./Pagination";

import { getAssets } from "./api/assetsApi";
import AIAssistant from "./assets/AIAssistant";

import "./Incidents.css";

export default function Incidents() {

  // ==========================
  // State
  // ==========================

  const [incidents, setIncidents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedIncident, setSelectedIncident] = useState(null);

  const pageSize = 8;

  // ==========================
  // Load Assets -> Incidents
  // ==========================

  const fetchIncidents = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await getAssets();

      const assets = response?.data || [];

      const generatedIncidents = assets.map((asset) => {

        let priority = "LOW";
        let status = "RESOLVED";
        let title = "Infrastructure Alert";

        if (
          asset.health?.toLowerCase() === "critical"
        ) {

          priority = "CRITICAL";

          status = "INVESTIGATING";

          title = "Critical Infrastructure Alert";

        }
        else if (
          asset.health?.toLowerCase() === "warning"
        ) {

          priority = "HIGH";

          status = "OPEN";

          title = "Asset Health Warning";

        }
        else if (
          asset.status?.toLowerCase() === "inactive"
        ) {

          priority = "MEDIUM";

          status = "OPEN";

          title = "Inactive Asset";

        }

        return {

          id: asset.id,

          title,

          asset: asset.name,

          priority,

          status,

          assignedTo:
            asset.owner || "SOC Team",

          description:
            `${asset.name} (${asset.ip}) requires monitoring.`,

          createdAt:
            asset.updatedAt ||
            asset.createdAt ||
            new Date().toISOString(),

          assetData: asset,

        };

      });

      setIncidents(generatedIncidents);

    }
    catch (err) {

      console.error(err);

      setError("Unable to load incidents.");

      toast.error("Unable to load incidents.");

    }
    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchIncidents();

  }, []);

  // ==========================
  // Refresh
  // ==========================

  const handleRefresh = () => {

    fetchIncidents();

    toast.success("Incidents refreshed");

  };

  // ==========================
  // Update Status (Local Only)
  // ==========================

  const updateStatus = (id, newStatus) => {

    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              status: newStatus,
            }
          : incident
      )
    );

    toast.success(
      `Incident marked as ${newStatus}`
    );

  };

  // ==========================
  // Search & Filter
  // ==========================

  const filteredIncidents = useMemo(() => {

    return incidents.filter((incident) => {

      const matchSearch =

        incident.title
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        incident.asset
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        incident.assignedTo
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =

        statusFilter === "ALL"

        ||

        incident.status === statusFilter;

      const matchPriority =

        priorityFilter === "ALL"

        ||

        incident.priority === priorityFilter;

      return (

        matchSearch &&

        matchStatus &&

        matchPriority

      );

    });

  }, [

    incidents,

    search,

    statusFilter,

    priorityFilter,

  ]);

  // ==========================
  // Dashboard Statistics
  // ==========================

  const openCount = filteredIncidents.filter(
    i => i.status === "OPEN"
  ).length;

  const investigatingCount = filteredIncidents.filter(
    i => i.status === "INVESTIGATING"
  ).length;

  const resolvedCount = filteredIncidents.filter(
    i => i.status === "RESOLVED"
  ).length;

  const assignedCount = filteredIncidents.filter(
    i => i.status === "ASSIGNED"
  ).length;

  // ==========================
  // Pagination
  // ==========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredIncidents.length / pageSize
    )
  );

  const currentIncidents =
    filteredIncidents.slice(

      (currentPage - 1) * pageSize,

      currentPage * pageSize

    );
      // ==========================
  // Return UI
  // ==========================

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Navbar />
        <AIAssistant />

        <motion.div
          className="incidents-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* ================= Header ================= */}

          <div className="page-header">
            <div>
              <h1>Incident Response Center</h1>
              <p>
                Incidents are automatically generated from your Asset Inventory.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefresh}
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>

          {/* ================= Summary Cards ================= */}

          <div className="summary-grid">

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="summary-card open"
            >
              <FaExclamationTriangle />
              <h2>{investigatingCount}</h2>
              <span>Open</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="summary-card investigating"
            >
              <FaBug />
              <h2>{investigatingCount}</h2>
              <span>Investigating</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="summary-card resolved"
            >
              <FaCheckCircle />
              <h2>{resolvedCount}</h2>
              <span>Resolved</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="summary-card assigned"
            >
              <FaUserShield />
              <h2>{assignedCount}</h2>
              <span>Assigned</span>
            </motion.div>

          </div>

          {/* ================= Toolbar ================= */}

          <div className="toolbar">

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search incidents..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Priority</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

          </div>

          {/* ================= Loading ================= */}

          {loading && (
            <div className="loading-container">
              <div className="loader"></div>
              <h3>Loading Incidents...</h3>
            </div>
          )}

          {/* ================= Error ================= */}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* ================= Table ================= */}

          {!loading && !error && filteredIncidents.length > 0 && (

            <motion.div
              className="table-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <table className="incident-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Asset</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {currentIncidents.map((incident) => (

                    <motion.tr
                      key={incident.id}
                      whileHover={{ scale: 1.01 }}
                    >

                      <td>{incident.id}</td>

                      <td>{incident.asset}</td>

                      <td>{incident.title}</td>

                      <td>

                        <span
                          className={`priority ${incident.priority.toLowerCase()}`}
                        >
                          {incident.priority}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`status ${incident.status.toLowerCase()}`}
                        >
                          {incident.status}
                        </span>

                      </td>

                      <td>{incident.assignedTo}</td>

                      <td>
                        {new Date(
                          incident.createdAt
                        ).toLocaleString()}
                      </td>

                      <td>

                        <div className="table-actions">

                          <button
                            className="assign-btn"
                            onClick={() =>
                              updateStatus(
                                incident.id,
                                "ASSIGNED"
                              )
                            }
                          >
                            <FaUserShield />
                          </button>

                          <button
                            className="investigate-btn"
                            onClick={() =>
                              updateStatus(
                                incident.id,
                                "INVESTIGATING"
                              )
                            }
                          >
                            <FaBug />
                          </button>

                          <button
                            className="resolve-btn"
                            onClick={() =>
                              updateStatus(
                                incident.id,
                                "RESOLVED"
                              )
                            }
                          >
                            <FaCheckCircle />
                          </button>

                          <button
                            className="view-btn"
                            onClick={() =>
                              setSelectedIncident(
                                incident
                              )
                            }
                          >
                            <FaEye />
                          </button>

                        </div>

                      </td>

                    </motion.tr>

                  ))}

                </tbody>

              </table>

            </motion.div>

          )}

          {/* ================= Empty ================= */}

          {!loading &&
            !error &&
            filteredIncidents.length === 0 && (

              <div className="empty-state">

                <FaClipboardList size={70} />

                <h2>No Incidents Found</h2>

                <p>
                  No incidents were generated from the current assets.
                </p>

              </div>

            )}

          {/* ================= Pagination ================= */}

          {!loading &&
            !error &&
            filteredIncidents.length > pageSize && (

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

            )}

          {/* ================= Modal ================= */}

          {selectedIncident && (

            <div className="modal-overlay">

              <div className="incident-modal">

                <h2>Incident Details</h2>

                <p><strong>ID :</strong> {selectedIncident.id}</p>

                <p><strong>Asset :</strong> {selectedIncident.asset}</p>

                <p><strong>Title :</strong> {selectedIncident.title}</p>

                <p><strong>Priority :</strong> {selectedIncident.priority}</p>

                <p><strong>Status :</strong> {selectedIncident.status}</p>

                <p><strong>Owner :</strong> {selectedIncident.assignedTo}</p>

                <p><strong>Description :</strong></p>

                <p>{selectedIncident.description}</p>

                <button
                  className="close-btn"
                  onClick={() =>
                    setSelectedIncident(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          )}

        </motion.div>

        <Footer />

      </div>

    </div>
  );
}