import express from "express";
import bankData from "../services/fbnService.js";
//import { fbnBranches } from "../services/fbnService.js";

const router = express.Router();

// All branches
router.get("/branches", (req, res) => {
  res.json(bankData);
});

// By state
router.get("/branches/state/:state", (req, res) => {
  const state = req.params.state.toLowerCase();
  const filtered = bankData.filter(item =>
    item.state?.toLowerCase() === state
  );
  res.json(filtered);
});

// Search
router.get("/branches/city/:city", (req, res) => {
  const city = req.params.city.toLowerCase();
  const filtered = bankData.filter(item =>
    item.city?.toLowerCase() === city
  );
  res.json(filtered);
});

export default router;
