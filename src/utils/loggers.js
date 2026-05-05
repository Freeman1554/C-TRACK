import pino from "pino";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFolder = path.join(__dirname, "..", 'log')

const transport = pino.transport({
    target:'pino-roll',
    options: {file: path.join("logs", "log"), frequency: "daily", mkdir: true}
})
const logger = pino(transport)

export default  logger;