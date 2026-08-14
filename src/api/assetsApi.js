import API from "./axios";

// ===========================
// GET ALL ASSETS
// ===========================
export const getAssets = () => API.get("/assets");

// ===========================
// GET ASSET BY ID
// ===========================
export const getAssetById = (id) => API.get(`/assets/${id}`);

// ===========================
// CREATE ASSET
// ===========================
export const createAsset = async (asset) => {
  console.log("Creating Asset:", asset);

  try {
    const response = await API.post("/assets", asset);

    console.log("Create Success:", response.data);

    return response.data;
  } catch (error) {
    console.error("Create Error:", error.response);

    throw error;
  }
};

// ===========================
// UPDATE ASSET
// ===========================
export const updateAsset = async (id, asset) => {
  console.log("Updating Asset:", id);

  try {
    const response = await API.put(`/assets/${id}`, asset);

    console.log("Update Success:", response.data);

    return response.data;
  } catch (error) {
    console.error("Update Error:", error.response);

    throw error;
  }
};

// ===========================
// DELETE ASSET
// ===========================
export const deleteAsset = (id) =>
  API.delete(`/assets/${id}`);

// ===========================
// SEARCH
// ===========================
export const searchAssets = (keyword) =>
  API.get(`/assets/search?keyword=${keyword}`);

// ===========================
// DISCOVERY
// ===========================
export const discoverAssets = () =>
  API.get("/assets/discover");

// ===========================
// NETWORK SCAN
// ===========================
export const scanNetwork = (subnet) =>
  API.get(`/assets/scan?subnet=${subnet}`);

// ===========================
// FILTERS
// ===========================
export const getAssetsByDepartment = (department) =>
  API.get(`/assets/department/${department}`);

export const getAssetsByOwner = (owner) =>
  API.get(`/assets/owner/${owner}`);

export const getAssetsByStatus = (status) =>
  API.get(`/assets/status/${status}`);

export const getAssetsByHealth = (health) =>
  API.get(`/assets/health/${health}`);