// src/services/bankService.js
import { loadBankData as loadExcelData } from "./fbnService.js";
import database from "../config/database.js"
import { loadBranches as loadAccessBranches, branches as accessBranches } from "./accessapi.js"; // adjust imports if needed

export async function loadAllBanks() {
  // Load Excel data
  const excelData = loadExcelData();

  // Load Access Bank branches
  await loadAccessBranches(); // ensure they are loaded in memory
  const accessData = accessBranches; // assuming your accessapi stores loaded branches in a variable

  return {
    excelData,
    accessData,
    totalCount: excelData.length + accessData.length,
  };
}

export const loadAllBranchAddress = async()=>{
  const [rows] = await database.query(
    "SELECT branchaddress FROM bankRegister",//change table + column if needed
    
  );
  
  return rows;
};