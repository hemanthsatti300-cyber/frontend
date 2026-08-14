// src/Vulnerabilities.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FaBug,
  FaShieldVirus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Pagination from "./Pagination";

import { getAssets } from "./api/assetsApi";
import AIAssistant from "./assets/AIAssistant";

import "./Vulnerabilities.css";

function Vulnerabilities() {
  // =====================================================
  // STATE
  // =====================================================

  const [assets, setAssets] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // =====================================================
  // HELPERS
  // =====================================================

  const normalizeText = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const safeNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  const getAssetName = (asset) =>
    asset.assetName ||
    asset.name ||
    asset.hostname ||
    `Asset-${asset.id}`;

  const getVendor = (asset) =>
    asset.manufacturer ||
    asset.vendor ||
    "Unknown";

  // =====================================================
  // LOAD ASSETS
  // =====================================================

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAssets();

      const assetList = Array.isArray(response?.data)
        ? response.data
        : [];

      setAssets(assetList);

      const generated = generateVulnerabilities(assetList);

      setVulnerabilities(generated);
    } catch (err) {
      console.error("Vulnerability load error:", err);

      setError("Unable to load vulnerabilities.");

      toast.error(
        "Unable to load vulnerabilities."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GENERATE VULNERABILITIES FROM ASSETS
  // =====================================================

  const generateVulnerabilities = (assetList) => {
    const generated = [];

    if (!Array.isArray(assetList)) {
      return generated;
    }

    assetList.forEach((asset) => {
      const assetName = getAssetName(asset);
      const vendor = getVendor(asset);

      const riskScore = safeNumber(
        asset.riskScore
      );

      const firewall = normalizeText(
        asset.firewall
      );

      const antivirus = normalizeText(
        asset.antivirus
      );

      const health = normalizeText(
        asset.health
      );

      const status = normalizeText(
        asset.status
      );

      const patch = normalizeText(
        asset.patchLevel
      );

      const operatingSystem = normalizeText(
        asset.operatingSystem || asset.os
      );

      const defaultCredentials = normalizeText(
        asset.defaultCredentials
      );

      const internetFacing = normalizeText(
        asset.internetFacing
      );

      // =================================================
      // 1. RISK SCORE VULNERABILITY
      // =================================================

      if (riskScore >= 90) {
        generated.push({
          id: `${asset.id}-critical-risk`,
          cve: `CVE-2026-${1000 + safeNumber(asset.id)}`,
          asset: assetName,
          vendor,
          severity: "CRITICAL",
          cvss: 9.8,
          patchStatus:
            patch === "latest"
              ? "Patched"
              : "Missing",
          status: "OPEN",
          recommendation:
            "Apply emergency security patches immediately.",
          source: "Risk Score",
        });
      } else if (riskScore >= 75) {
        generated.push({
          id: `${asset.id}-high-risk`,
          cve: `CVE-2026-${2000 + safeNumber(asset.id)}`,
          asset: assetName,
          vendor,
          severity: "HIGH",
          cvss: 8.4,
          patchStatus:
            patch === "latest"
              ? "Patched"
              : "Pending",
          status: "OPEN",
          recommendation:
            "Update operating system and vulnerable software.",
          source: "Risk Score",
        });
      } else if (riskScore >= 50) {
        generated.push({
          id: `${asset.id}-medium-risk`,
          cve: `CVE-2026-${3000 + safeNumber(asset.id)}`,
          asset: assetName,
          vendor,
          severity: "MEDIUM",
          cvss: 6.2,
          patchStatus:
            patch === "latest"
              ? "Patched"
              : "Pending",
          status: "MONITORING",
          recommendation:
            "Schedule remediation during the next maintenance window.",
          source: "Risk Score",
        });
      } else {
        generated.push({
          id: `${asset.id}-low-risk`,
          cve: `CVE-2026-${4000 + safeNumber(asset.id)}`,
          asset: assetName,
          vendor,
          severity: "LOW",
          cvss: 3.1,
          patchStatus: "Patched",
          status: "SAFE",
          recommendation:
            "No immediate remediation required.",
          source: "Risk Score",
        });
      }

      // =================================================
      // 2. FIREWALL DISABLED
      // =================================================

      if (firewall === "disabled") {
        generated.push({
          id: `${asset.id}-fw`,
          cve: `FW-${asset.id}`,
          asset: assetName,
          vendor: "Firewall",
          severity: "HIGH",
          cvss: 8.2,
          patchStatus: "N/A",
          status: "OPEN",
          recommendation:
            "Enable firewall protection immediately.",
          source: "Firewall",
        });
      }

      // =================================================
      // 3. ANTIVIRUS DISABLED
      // =====================================================

      if (antivirus === "disabled") {
        generated.push({
          id: `${asset.id}-av`,
          cve: `AV-${asset.id}`,
          asset: assetName,
          vendor: "Endpoint Security",
          severity: "MEDIUM",
          cvss: 6.5,
          patchStatus: "N/A",
          status: "OPEN",
          recommendation:
            "Enable antivirus and perform a full system scan.",
          source: "Antivirus",
        });
      }

      // =================================================
      // 4. CRITICAL HEALTH
      // =================================================

      if (health === "critical") {
        generated.push({
          id: `${asset.id}-health`,
          cve: `SYS-${asset.id}`,
          asset: assetName,
          vendor,
          severity: "HIGH",
          cvss: 7.8,
          patchStatus: "N/A",
          status: "OPEN",
          recommendation:
            "Investigate system health immediately.",
          source: "Health",
        });
      }

      // =================================================
      // 5. WARNING HEALTH
      // =================================================

      if (health === "warning") {
        generated.push({
          id: `${asset.id}-warning`,
          cve: `WARN-${asset.id}`,
          asset: assetName,
          vendor,
          severity: "MEDIUM",
          cvss: 5.9,
          patchStatus: "N/A",
          status: "MONITORING",
          recommendation:
            "Monitor system resources and schedule maintenance.",
          source: "Health",
        });
      }

      // =================================================
      // 6. OUTDATED PATCH
      // =================================================

      if (patch === "outdated") {
        generated.push({
          id: `${asset.id}-patch`,
          cve: `PATCH-${asset.id}`,
          asset: assetName,
          vendor,
          severity: "HIGH",
          cvss: 8.1,
          patchStatus: "Missing",
          status: "OPEN",
          recommendation:
            "Install the latest cumulative security updates.",
          source: "Patch",
        });
      }

      // =================================================
      // 7. INACTIVE ASSET
      // =================================================

      if (status === "inactive") {
        generated.push({
          id: `${asset.id}-inactive`,
          cve: `ASSET-${asset.id}`,
          asset: assetName,
          vendor,
          severity: "MEDIUM",
          cvss: 5.5,
          patchStatus: "Unknown",
          status: "MONITORING",
          recommendation:
            "Verify whether this inactive asset should remain connected.",
          source: "Asset Status",
        });
      }

      // =================================================
      // 8. UNSUPPORTED OPERATING SYSTEM
      // =================================================

      if (
        operatingSystem.includes("windows 7") ||
        operatingSystem.includes("windows xp") ||
        operatingSystem.includes("ubuntu 16") ||
        operatingSystem.includes("centos 6")
      ) {
        generated.push({
          id: `${asset.id}-os`,
          cve: `OS-${asset.id}`,
          asset: assetName,
          vendor,
          severity: "CRITICAL",
          cvss: 9.5,
          patchStatus: "Unsupported",
          status: "OPEN",
          recommendation:
            "Upgrade the operating system immediately.",
          source: "Operating System",
        });
      }

      // =================================================
      // 9. DEFAULT CREDENTIALS
      // =================================================

      if (defaultCredentials === "yes") {
        generated.push({
          id: `${asset.id}-cred`,
          cve: `AUTH-${asset.id}`,
          asset: assetName,
          vendor,
          severity: "CRITICAL",
          cvss: 9.1,
          patchStatus: "N/A",
          status: "OPEN",
          recommendation:
            "Change default credentials immediately.",
          source: "Authentication",
        });
      }

      // =================================================
      // 10. INTERNET FACING ASSET
      // =================================================

      if (internetFacing === "yes") {
        generated.push({
          id: `${asset.id}-internet`,
          cve: `NET-${asset.id}`,
          asset: assetName,
          vendor,
          severity: "HIGH",
          cvss: 8.7,
          patchStatus: "N/A",
          status: "OPEN",
          recommendation:
            "Review exposed ports and firewall rules.",
          source: "Network Exposure",
        });
      }
    });

    return generated;
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchAssets();

    const interval = setInterval(() => {
      fetchAssets();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    await fetchAssets();
    toast.success("Vulnerabilities refreshed.");
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredVulnerabilities = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return vulnerabilities.filter((item) => {
      const matchesSearch =
        item.cve.toLowerCase().includes(keyword) ||
        item.asset.toLowerCase().includes(keyword) ||
        item.vendor.toLowerCase().includes(keyword) ||
        item.source.toLowerCase().includes(keyword);

      const matchesSeverity =
        severityFilter === "ALL" ||
        item.severity === severityFilter;

      return (
        matchesSearch &&
        matchesSeverity
      );
    });
  }, [
    vulnerabilities,
    search,
    severityFilter,
  ]);

  // =====================================================
  // GLOBAL COUNTS
  // IMPORTANT: cards use ALL vulnerabilities,
  // not filtered data. This keeps Critical count stable
  // while searching/filtering the table.
  // =====================================================

  const vulnerabilityCounts = useMemo(() => {
    return {
      total: vulnerabilities.length,

      critical: vulnerabilities.filter(
        (item) => item.severity === "CRITICAL"
      ).length,

      high: vulnerabilities.filter(
        (item) => item.severity === "HIGH"
      ).length,

      medium: vulnerabilities.filter(
        (item) => item.severity === "MEDIUM"
      ).length,

      low: vulnerabilities.filter(
        (item) => item.severity === "LOW"
      ).length,
    };
  }, [vulnerabilities]);

  const {
    total: totalVulnerabilities,
    critical,
    high,
    medium,
    low,
  } = vulnerabilityCounts;

  // =====================================================
  // CHART DATA
  // =====================================================

  const pieData = [
    {
      name: "Critical",
      value: critical,
    },
    {
      name: "High",
      value: high,
    },
    {
      name: "Medium",
      value: medium,
    },
    {
      name: "Low",
      value: low,
    },
  ];

  const COLORS = [
    "#ef4444",
    "#fb923c",
    "#f59e0b",
    "#22c55e",
  ];

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredVulnerabilities.length /
        pageSize
    )
  );

  const currentData =
    filteredVulnerabilities.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    severityFilter,
  ]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Navbar />
        <AIAssistant />

        <motion.div
          className="vulnerability-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="page-header">
            <div>
              <h1>Vulnerability Dashboard</h1>

              <p>
                Automatically generated vulnerabilities based on your
                Asset Inventory.
              </p>

              <small>
                Total vulnerabilities: {totalVulnerabilities}
              </small>
            </div>

            <button
              type="button"
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={loading}
            >
              <FaSyncAlt />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="summary-grid">
            <motion.div
              className="summary-card critical"
              whileHover={{ scale: 1.03 }}
            >
              <FaShieldVirus />

              <h2>{critical}</h2>

              <span>Critical</span>
            </motion.div>

            <motion.div
              className="summary-card high"
              whileHover={{ scale: 1.03 }}
            >
              <FaExclamationTriangle />

              <h2>{high}</h2>

              <span>High</span>
            </motion.div>

            <motion.div
              className="summary-card medium"
              whileHover={{ scale: 1.03 }}
            >
              <FaBug />

              <h2>{medium}</h2>

              <span>Medium</span>
            </motion.div>

            <motion.div
              className="summary-card low"
              whileHover={{ scale: 1.03 }}
            >
              <FaCheckCircle />

              <h2>{low}</h2>

              <span>Low</span>
            </motion.div>
          </div>

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="toolbar">
            <div className="search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Search CVE, Asset, Vendor or Source..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(
                  event.target.value
                )
              }
            >
              <option value="ALL">
                All Severity
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="LOW">
                Low
              </option>
            </select>
          </div>

          {/* =================================================
              CHARTS
          ================================================= */}

          <div className="chart-grid">
            <motion.div
              className="chart-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3>
                Severity Distribution
              </h3>

              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {pieData.map(
                      (entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={
                            COLORS[
                              index % COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="chart-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3>
                Severity Overview
              </h3>

              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart data={pieData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="loading-container">
              <div className="loader"></div>

              <h3>
                Loading Vulnerabilities...
              </h3>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* =================================================
              TABLE
          ================================================= */}

          {!loading &&
            !error &&
            filteredVulnerabilities.length > 0 && (
              <motion.div
                className="table-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <table className="vulnerability-table">
                  <thead>
                    <tr>
                      <th>CVE ID</th>
                      <th>Asset</th>
                      <th>Vendor</th>
                      <th>Severity</th>
                      <th>CVSS</th>
                      <th>Patch</th>
                      <th>Status</th>
                      <th>Source</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentData.map((item) => (
                      <motion.tr
                        key={item.id}
                        whileHover={{ scale: 1.01 }}
                      >
                        <td>{item.cve}</td>

                        <td>{item.asset}</td>

                        <td>{item.vendor}</td>

                        <td>
                          <span
                            className={`severity ${item.severity.toLowerCase()}`}
                          >
                            {item.severity}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`cvss ${
                              item.cvss >= 9
                                ? "critical"
                                : item.cvss >= 7
                                ? "high"
                                : item.cvss >= 4
                                ? "medium"
                                : "low"
                            }`}
                          >
                            {safeNumber(
                              item.cvss
                            ).toFixed(1)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`patch ${String(
                              item.patchStatus || ""
                            )
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {item.patchStatus}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status ${String(
                              item.status || ""
                            )
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>{item.source}</td>

                        <td>
                          {item.recommendation}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            !error &&
            filteredVulnerabilities.length === 0 && (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaBug size={70} />

                <h2>
                  No Vulnerabilities Found
                </h2>

                <p>
                  No vulnerabilities match your current search or
                  selected severity filter.
                </p>
              </motion.div>
            )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!loading &&
            !error &&
            filteredVulnerabilities.length > pageSize && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
        </motion.div>

        <Footer />
      </div>
    </div>
  );
}

export default Vulnerabilities;
