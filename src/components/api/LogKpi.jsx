import axios from "axios";

export const logKpi = async ({ apiName, apiUrl, httpCode, responseTime }) => {
  console.log({
    apiName,
    apiUrl,
    httpCode,
    responseTime,
  });

  try {
    await axios.post("/api/apimonitoring", {
      apiName,
      apiUrl,
      httpCode,
      responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement KPI :", err);
  }
};
