import axios from "axios";
import * as xlsx from "xlsx";
import fs from "fs";
import https from "https";
import path from "path";

const EXCEL_URL = "https://www.accessbankplc.com/AccessBankGroup/media/Documents/BranchList.xlsx";
const CACHE_FILE = path.resolve("branch_cache.xlsx");
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export let branches = [];

// Initialize branches
export async function loadBranches() {
  try {
    const data = await downloadExcelWithCache();
    branches = parseBranchExcel(data);
    console.log("Branch list loaded:", branches.length);
  } catch (err) {
    console.error("Failed to load branches:", err);
  }
}



// Download Excel + cache
async function downloadExcelWithCache() {
  const now = Date.now();

  if (fs.existsSync(CACHE_FILE)) {
    const stats = fs.statSync(CACHE_FILE);
    if (now - stats.mtimeMs < CACHE_TTL) {
      return fs.readFileSync(CACHE_FILE);
    }
  }

  const agent = new https.Agent({ rejectUnauthorized: false });

  const response = await axios.get(EXCEL_URL, {
    responseType: "arraybuffer",
    httpsAgent: agent,
  });

  fs.writeFileSync(CACHE_FILE, response.data);

  return response.data;
}

// // Parse Excel
function parseBranchExcel(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  return json.map((row) => {
    const cleaned = {};
    for (const key in row) {
      cleaned[key.toLowerCase().replace(/ /g, "_")] = row[key];
    }
    return cleaned;
  });
}





