import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { getAssets } from "./api/assetsApi";
import AIAssistant from "./assets/AIAssistant";

import "./Alerts.css";

function Alerts() {

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==============================
  // LOAD ASSETS
  // ==============================

  const fetchAssets = async () => {

    try {

      setLoading(true);

      const response = await getAssets();

      const assetData = response?.data || [];

      // Generate alerts from assets
      generateAlerts(assetData);

    } catch (error) {

      console.error(
        "Failed to load assets:",
        error.response?.data || error.message
      );

      toast.error("Unable to load asset alerts.");

    } finally {

      setLoading(false);

    }

  };

  // ==============================
  // GENERATE ALERTS FROM ASSETS
  // ==============================

  const generateAlerts = (assetList) => {

    const generatedAlerts = [];

    assetList.forEach((asset) => {

      // Critical Health
      if (
        asset.health?.toLowerCase() === "critical"
      ) {

        generatedAlerts.push({
          id: `health-${asset.id}`,
          assetId: asset.id,
          assetName:
            asset.assetName ||
            asset.hostname ||
            `Asset ${asset.id}`,
          type: "Health",
          severity: "Critical",
          status: "OPEN",
          description:
            "Asset health is in critical condition.",
        });

      }

      // Inactive Asset
      if (
        asset.status?.toLowerCase() === "inactive"
      ) {

        generatedAlerts.push({
          id: `status-${asset.id}`,
          assetId: asset.id,
          assetName:
            asset.assetName ||
            asset.hostname ||
            `Asset ${asset.id}`,
          type: "Status",
          severity: "High",
          status: "OPEN",
          description:
            "Asset is currently inactive.",
        });

      }

      // High Risk
      if (
        Number(asset.riskScore) >= 80
      ) {

        generatedAlerts.push({
          id: `risk-${asset.id}`,
          assetId: asset.id,
          assetName:
            asset.assetName ||
            asset.hostname ||
            `Asset ${asset.id}`,
          type: "Security Risk",
          severity: "Critical",
          status: "OPEN",
          description:
            `High security risk detected. Risk score: ${asset.riskScore}%.`,
        });

      }

      // Medium Risk
      else if (
        Number(asset.riskScore) >= 50
      ) {

        generatedAlerts.push({
          id: `risk-${asset.id}`,
          assetId: asset.id,
          assetName:
            asset.assetName ||
            asset.hostname ||
            `Asset ${asset.id}`,
          type: "Security Risk",
          severity: "Medium",
          status: "OPEN",
          description:
            `Medium security risk detected. Risk score: ${asset.riskScore}%.`,
        });

      }

    });

    setAlerts(generatedAlerts);

  };

  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {

    fetchAssets();

    const interval = setInterval(() => {
      fetchAssets();
    }, 15000);

    return () => clearInterval(interval);

  }, []);

  // ==============================
  // COUNTS
  // ==============================

  const criticalAlerts = alerts.filter(
    (alert) =>
      alert.severity === "Critical"
  ).length;

  const highAlerts = alerts.filter(
    (alert) =>
      alert.severity === "High"
  ).length;

  const mediumAlerts = alerts.filter(
    (alert) =>
      alert.severity === "Medium"
  ).length;

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="content">

        <Navbar />
        <AIAssistant />
        <div className="alerts-page">

          <div className="alerts-header">

            <div>
              <h1>Security Alerts</h1>

              <p>
                Alerts generated from your asset inventory.
              </p>
            </div>

          </div>

          {/* ==============================
              ALERT SUMMARY
          ============================== */}

          <div className="alert-cards">

            <div className="alert-card critical">

              <FaExclamationTriangle />

              <div>
                <h3>Critical</h3>
                <h2>{criticalAlerts}</h2>
              </div>

            </div>

            <div className="alert-card high">

              <FaExclamationTriangle />

              <div>
                <h3>High</h3>
                <h2>{highAlerts}</h2>
              </div>

            </div>

            <div className="alert-card medium">

              <FaExclamationTriangle />

              <div>
                <h3>Medium</h3>
                <h2>{mediumAlerts}</h2>
              </div>

            </div>

            <div className="alert-card total">

              <FaCheckCircle />

              <div>
                <h3>Total Alerts</h3>
                <h2>{alerts.length}</h2>
              </div>

            </div>

          </div>

          {/* ==============================
              LOADING
          ============================== */}

          {loading && (
            <div className="loading">
              Loading alerts...
            </div>
          )}

          {/* ==============================
              ALERT TABLE
          ============================== */}

          {!loading && (

            <div className="table-container">

              <table className="alert-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Asset</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {alerts.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="no-data"
                      >
                        No active alerts found.
                      </td>

                    </tr>

                  ) : (

                    alerts.map((alert) => (

                      <tr key={alert.id}>

                        <td>
                          {alert.assetId}
                        </td>

                        <td>
                          {alert.assetName}
                        </td>

                        <td>
                          {alert.type}
                        </td>

                        <td>

                          <span
                            className={`severity ${alert.severity.toLowerCase()}`}
                          >
                            {alert.severity}
                          </span>

                        </td>

                        <td>
                          {alert.description}
                        </td>

                        <td>

                          <span
                            className="alert-status"
                          >
                            {alert.status}
                          </span>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        <Footer />

      </div>

    </div>

  );

}

export default Alerts;