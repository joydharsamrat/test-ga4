const express = require("express");
const cors = require("cors");
const app = express();
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

const auth = new GoogleAuth({
  keyFile: {
    client_email: process.env.GCLOUD_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    projectId: process.env.GCP_PROJECT_ID,
  },
  scopes: "https://www.googleapis.com/auth/analytics.readonly",
});

const analyticsDataClient = new BetaAnalyticsDataClient({ auth });

// Rest of your code remains unchanged
const propertyId = 435060008;

async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: "2024-03-31",
        endDate: "today",
      },
    ],
    dimensions: [
      {
        name: "pagePath",
      },
    ],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
  });

  console.log("Report result:");
  response.rows.forEach((row) => {
    console.log(row.dimensionValues[0], row.metricValues[0]);
  });
  return response;
}

app.get("/", (req, res) => {
  const result = runReport();
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
