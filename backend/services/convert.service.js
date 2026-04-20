import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execFileAsync = promisify(execFile);

class ConvertService {
    async mdToDocx(filePath, originalName = "output.md") {
        const baseName = path.parse(originalName).name;
        const outputPath = path.join(os.tmpdir(), `${baseName}-${Date.now()}.docx`);

        try {
            await execFileAsync("pandoc", [
                filePath,
                "-f", "markdown",
                "-o", outputPath
              ]);
            return outputPath;
        } catch (error) {
            this.safeDelete(outputPath);
            throw new Error(`Convert failed: ${error.message}`);
        }
    }

    safeDelete(filePath) {
        try {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error("Delete file error:", error.message);
        }
    }
}

export default new ConvertService();