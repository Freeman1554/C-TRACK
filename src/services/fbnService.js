import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//loading excel file
export function loadBankData(){
const workbook = XLSX.readFile(path.join(__dirname, "../bankaddress.xlsx"));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
return XLSX.utils.sheet_to_json(sheet);
}






// import fs from "fs";
// import path from "path";
// import puppeteer from "puppeteer";

// export let fbnBranches = [];

// const FBN_URL = "https://www.firstbanknigeria.com/contact/find-a-branch/";
// const CACHE_FILE = path.resolve("fbn_cache.json");
// const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// // -------------------------------
// // Extract State from Address
// // -------------------------------
// function extractState(address) {
//   const states = [
//     "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
//     "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu",
//     "FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi",
//     "Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun",
//     "Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
//   ];

//   address = address.toLowerCase();

//   for (const state of states) {
//     if (address.includes(state.toLowerCase())) return state;
//   }

//   return "";
// }

// // -------------------------------
// // Load FirstBank Branches with Puppeteer
// // -------------------------------
// export async function loadFBNBranches() {
//   try {
//     const now = Date.now();

//     // Use cache if fresh
//     if (fs.existsSync(CACHE_FILE)) {
//       const stats = fs.statSync(CACHE_FILE);
//       if (now - stats.mtimeMs < CACHE_TTL) {
//         console.log("Using cached FirstBank branches");
//         fbnBranches = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
//         return;
//       }
//     }

//     console.log("Launching Puppeteer to fetch FirstBank branches...");

//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     await page.goto(FBN_URL, { waitUntil: "networkidle2" });

//     // Wait for branch elements to render
//     await page.waitForSelector(".elementor-widget-wrap h4", {timeout:15000});

//     // Extract branch data
//     fbnBranches = await page.evaluate(() => {
//       const branches = [];
//       document.querySelectorAll(".elementor-widget-wrap").forEach(widget => {
//         const nameEl = widget.querySelector("h4");
//         const addressEl = widget.querySelector("p");
//         if (nameEl && addressEl) {
//           branches.push({
//             branch_name: nameEl.innerText.trim(),
//             branch_address: addressEl.innerText.trim()
//           });
//         }
//       });
//       return branches;
//     });

//     const html = await page.content();
//     if(process.env.DEBUG) {
//         fs.writeFileSync('fbn_page.html', await page.content());
//     }
    
//     await browser.close();

//     // Extract state for each branch
//     fbnBranches = fbnBranches.map(b => ({
//   ...b,
//   state: extractState(b.branch_address)
// }));
  
//     // Cache the result
//     fs.writeFileSync(CACHE_FILE, JSON.stringify(fbnBranches, null, 2));
//     console.log(`✔ FirstBank branches loaded: ${fbnBranches.length}`);

//   } catch (err) {
//     console.error("Could not load FirstBank branches:", err.message);
//   }
// }


 










// import axios from "axios";
// import fs from "fs";
// import path from "path";
// import * as cheerio from "cheerio";

// export let fbnBranches = [];

// const FBN_URL = "https://www.firstbanknigeria.com/contact/find-a-branch/";
// const CACHE_FILE = path.resolve("fbn_cache.html");
// const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// // -------------------------------
// // Download HTML with caching
// // -------------------------------
// async function downloadFBNWithCache() {
//   const now = Date.now();

//   if (fs.existsSync(CACHE_FILE)) {
//     const stats = fs.statSync(CACHE_FILE);

//     if (now - stats.mtimeMs < CACHE_TTL) {
//       console.log("Using cached FirstBank HTML");
//       return fs.readFileSync(CACHE_FILE, "utf8");
//     }
//   }

//   console.log("Downloading fresh FirstBank HTML...");

//   const response = await axios.get(FBN_URL, {
//     headers: { "User-Agent": "Mozilla/5.0" },
//   });

//   fs.writeFileSync(CACHE_FILE, response.data, "utf8");
//   console.log("✔ FirstBank HTML Cached");

//   return response.data;
// }

// // -------------------------------
// // Parse HTML using cheerio
// // -------------------------------
// function parseFBNHTML(html) {
//   const $ = cheerio.load(html);
//   const branches = [];

//   // All branch containers
//    $(".elementor-column").each((i, el) => {
//     const name = $(el).find("h4").first().text().trim();
//     const address = $(el).find("p").first().text().trim();
//     if (name && address) {
//       branches.push({
//         branch_name: name,
//         branch_address: address,
//         state: extractState(address),
//       });
//     }
//   });

//   return branches;
// }

// // -------------------------------
// // Extract State from Address
// // -------------------------------
// function extractState(address) {
//   const states = [
//     "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
//     "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu",
//     "FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi",
//     "Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun",
//     "Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
//   ];

//   address = address.toLowerCase();

//   for (const state of states) {
//     if (address.includes(state.toLowerCase())) return state;
//   }

//   return "";
// }

// // -------------------------------
// // Load FirstBank Branches
// // -------------------------------
// export async function loadFBNBranches() {
//   try {
//     console.log("Loading FirstBank branches...");

//     const html = await downloadFBNWithCache();
//     fbnBranches = parseFBNHTML(html);

//     console.log("✔ FirstBank branches loaded:", fbnBranches.length);
//   } catch (err) {
//     console.error("Could not load FirstBank branches:", err.message);
//   }
// }



















// // import axios from "axios";
// // import fs from "fs";
// // import path from "path";
// // import * as cheerio from "cheerio";

// // export let fbnBranches = [];

// // const FBN_URL = "https://www.firstbanknigeria.com/contact/find-a-branch/";
// // const CACHE_FILE = path.resolve("fbn_cache.html");
// // const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// // // -------------------------------
// // // Download HTML with caching
// // // -------------------------------
// // async function downloadFBNWithCache() {
// //   const now = Date.now();

// //   if (fs.existsSync(CACHE_FILE)) {
// //     const stats = fs.statSync(CACHE_FILE);

// //     if (now - stats.mtimeMs < CACHE_TTL) {
// //       console.log("Using cached FirstBank HTML");
// //       return fs.readFileSync(CACHE_FILE, "utf8");
// //     }

// //     console.log("Downloading fresh FirstBank HTML...");
// //     const response = await axios.get(FBN_URL,{
// //         headers: {"User-Agent": "Mozilla/5.0"},
// //     })
// //   } 

  

// //     fs.writeFileSync(CACHE_FILE, response.data, "utf8");
// //     console.log(" FirstBank HTML Cached");

// //     return response.data;
// //   } 

    
// // // -------------------------------
// // // Parse HTML using cheerio
// // // -------------------------------
// // function parseFBNHTML(html) {
// //   const $ = cheerio.load(html);
// //   const branches = [];

// //   $(".wp-block-columns").each((i, el) => {
// //     const name = $(el).find("h4").text().trim();
// //     const address = $(el).find("p").text().trim();

// //     if (!name || !address) return;

// //     branches.push({
// //       branch_name: name,
// //       branch_address: address,
// //       state: extractState(address),
// //     });
// //   });

// //   return branches;
// // }

// // // -------------------------------
// // // Extract State from Address
// // // -------------------------------
// // function extractState(address) {
// //   const states = [
// //     "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
// //     "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu",
// //     "FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi",
// //     "Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun",
// //     "Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"
// //   ];

// //   address = address.toLowerCase();

// //   //const lower = address.toLowerCase();

// //   for (const state of states) {
// //     if (address.includes(state.toLowerCase())) return state;
// //   }

// //   return "";
// // }

// // // -------------------------------
// // // Load FirstBank Branches
// // // -------------------------------
// // export async function loadFBNBranches() {
// //   try {
// //     console.log("Loading FirstBank branches...");

// //     const html = await downloadFBNWithCache();
// //     fbnBranches = parseFBNHTML(html);

// //     console.log("FirstBank branches loaded:", fbnBranches.length);
// //   } catch (err) {
// //     console.error("Could not load FirstBank branches:", err.message);
// //   }
// // }








// // // import axios from "axios";
// // // import fs from "fs";
// // // import path from "path";

// // // export let fbnBranches = [];

// // // const FBN_API_URL = "https://www.firstbanknigeria.com/wp-json/wp/v2/branches?per_page=200";
// // // const CACHE_FILE = path.resolve("fbn_cache.json");
// // // const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hrs

// // // // --------------------------------------------------
// // // // Load FirstBank branches from API (with caching)
// // // // --------------------------------------------------
// // // export async function loadFBNBranches() {
// // //   const now = Date.now();

// // //   // 1. Use cache if fresh
// // //   if (fs.existsSync(CACHE_FILE)) {
// // //     const stats = fs.statSync(CACHE_FILE);
// // //     if (now - stats.mtimeMs < CACHE_TTL) {
// // //       console.log("Using cached FirstBank branches");
// // //       fbnBranches = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
// // //       return;
// // //     }
// // //   }

// // //   // 2. Fetch live API
// // //   try {
// // //     console.log("Fetching FirstBank branches from API...");

// // //     const response = await axios.get(FBN_API_URL, {
// // //       headers: { "User-Agent": "Mozilla/5.0" },
// // //     });

// // //     // Normalize data
// // //     fbnBranches = response.data.map((b) => ({
// // //       branch_name: b.title.rendered,
// // //       branch_address: b.acf?.address || "",
// // //       state: b.acf?.state || "",
// // //       phone: b.acf?.phone || "",
// // //       email: b.acf?.email || ""
// // //     }));

// // //     // Save cache
// // //     fs.writeFileSync(CACHE_FILE, JSON.stringify(fbnBranches, null, 2));
// // //     console.log("FBN branches loaded:", fbnBranches.length);

// // //   } catch (err) {
// // //     console.error("Failed to fetch FBN API:", err.message);

// // //     if (fs.existsSync(CACHE_FILE)) {
// // //       console.log("Using cached data due to API failure");
// // //       fbnBranches = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
// // //       return;
// // //     }

// // //     throw new Error("NO FirstBank data available.");
// // //   }
// // // }





