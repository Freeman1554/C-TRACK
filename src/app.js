import express from "express";
import config from "./config/index.js";
import sequelize, { connectDB } from "./config/database.js"
import models from "./models/bankRegister.js";
import Delivery from "./models/delivery.js";
import RequestOrder from "./models/order.js";
import { importAllBankData } from "./utils/importBankData.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import bankRoutes from "./routes/bankRegisterRoute.js"
import { loadBranches } from "./services/accessapi.js";
import { loadBankData } from "./services/fbnService.js";
import adminRoutes from "./routes/adminRoute.js";




//init express app
const app = express();
const bankData = loadBankData();



const corsOptions = {
  origin: "http://localhost:59940",
};

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));


//routes
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running fine and healthy" });
});

await loadBranches()
// console.log("Branches loaded in memory:", branches.length)
app.use("/api", bankRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// route defaults
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route does not exist" });
});

app.use(errorHandler);

//start server
await connectDB();
await importAllBankData();

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
