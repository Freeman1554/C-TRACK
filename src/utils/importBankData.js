import XLSX from 'xlsx';
import fs from "fs";
import BankRegister from "../models/bankRegister.js";
import path from "path";
import { fileURLToPath } from 'url';
//import { loadBankName } from '../services/bankService.js';


export const importAllBankData = async()=> {
    try{
        const filePath = path.join(process.cwd(), "src", "bankaddress.xlsx");
        console.log("Looking for Excel file at:", filePath);
        console.log("Exists:", fs.existsSync(filePath));

        if(!fs.existsSync(filePath)){
            console.error("Bank Excel file not found:", filePath);
            return;
        }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    for (const row of data){
        console.log("Parsed row:", row)
        await BankRegister.create(row);
    }
    console.log("Bank data imported successfully:");
    } catch(error) {
        console.error("Error importing bank data:", error.message)
    }

     
}


// export const bankName = async(req, res)=> {
//     try{
//         const bankName = await loadBankName(req.params.id);
//         if(!bankName) {
//             return res.status(400).json({
//                 success: false, message: "User or bank not found"
//             });
//         }
//         res.json({
//             success: true,
//             bankName
//         });
//     }    catch(err){
//         res.status(500).json({success:false, message:err.message});
//     }
// }

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



// export async function importAllBankData() {
//   try {
//     const filePath = path.join(__dirname, "../bankaddress.xlsx");
//     console.log("READING FILE AT:", filePath);
//     //const file = "data/banks.xlsx";   // <-- path to your excel inside project

//     // const workbook = xlsx.readFile(filePath);
//     // const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     // const rows = xlsx.utils.sheet_to_json(sheet, {defval: ""});

//     console.log("Loaded", rows.length, "records from Excel");

//     if (rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Excel file is empty"
//       });
//     }

//     // Map Excel to database structure
//     const mapped = rows.map(row => ({
//       bank: row.bank || row.Bank || "",
//       branchname: row.branchname || row.BranchName || row["Branch Name"] || "",
//       zone: row.zone || row.Zone || row.zone_name || row["Zone Name"] || "",
//       branchaddress: row.branchaddress || row["Branch Address"] || "",
//       localgovt: row.localgovt || row.LocalGovt || row["Local Govt"] || "",
//       state: row.state || row.State || "",
//     }));

//     // Save to DB
//     await BankRegister.bulkCreate(mapped, { ignoreDuplicates: true });

//     res.json({
//       success: true,
//       imported: mapped.length,
//       message: "Excel data imported successfully"
//     });

//   } catch (err) {
//     console.error("import error:", err);
//     throw err;
//     // res.status(500).json({
//     //   success: false,
//     //   message: err.message
//     // });
//   }
// };





// import XLSX from "xlsx";
// import BankRegister from "../models/bankRegister.js";
// import { branches, loadBranches } from "../services/accessapi.js";
// import { loadAllBanks } from "../services/bankService.js";
// import path from "path";
// import { fileURLToPath } from "url";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// function loadLocalBanks() {
//     const workbook = XLSX.readFile(path.join(__dirname, "../bankaddress.xlsx"));
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = XLSX.utils.sheet_to_json(sheet, {defval: ""});

//     return rows.map((row) =>({
//         bank: row.bank || row.bank || "First Bank",
//         branchname: row.branchname || row.branch_name || "",
//         zone: row.zone || row.zone_name || "",
//         branchaddress: row.branchaddress || row.branch_address || row.address || "",
//         localgovt: row.localgovt || row.local_govt || row.lga || "",
//         state: row.state || "",
//     }))
// }

// export async function importAllBankData() {
//     try {
//         //console.log("Loading local Excel...");
//         const localBanks = loadLocalBanks();
//         //console.log("loading remote excel...");
//         await loadBranches();
//         const remoteBanks = branches.map((b) =>({
//             bank: b.bank || "Access Bank",
//             branchname: b.branch || b.branchname || "",
//             zone: b.zone || "",
//             branchaddress: b.address || b.branchaddr || "",
//             localgovt: b.localgovt || b.lga || "",
//             state: b.state || "",
//         }));

//         const allBanks = [...localBanks, ...remoteBanks];
//         //console.log("inserting into MySQL:", allBanks.length, "records...");
//         const cleanedBanks = allBanks.filter((b)=>
//         b.bank && b.zone && b.branchaddress && b.localgovt && b.state
//         );
//         //console.log("Saving:", cleanedBanks.length, "records...");

//         await BankRegister.bulkCreate(cleanedBanks, {
//             ignoreDuplicates: true,
//         });
//         //console.log("Excel data sucessfully saved to MySQL");
//     } catch(error) {
//         console.error("Failed to import Excel date", error)
//     }
// }