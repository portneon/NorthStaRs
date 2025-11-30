const axios = require('axios');

// Piston API configuration
const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

/**
 * Piston API Service
 * Handles code execution through the Piston API
 */
class PistonService {
    /**
     * Execute code using Piston API
     * @param {string} language - Language identifier (e.g., 'javascript', 'python')
     * @param {string} version - Language version (e.g., '18.15.0' for Node.js)
     * @param {string} code - Source code to execute
     * @param {string} stdin - Standard input for the program (optional)
     * @param {number} timeout - Execution timeout in milliseconds (default: 10000)
     * @returns {Promise<Object>} Execution result with stdout, stderr, and metadata
     */
    async executeCode(language, version, code, stdin = '', timeout = 10000) {
        try {
            const response = await axios.post(
                `${PISTON_API_URL}/execute`,
                {
                    language,
                    version,
                    files: [
                        {
                            name: `main.${this.getFileExtension(language)}`,
                            content: code,
                        },
                    ],
                    stdin,
                    compile_timeout: timeout,
                    run_timeout: timeout,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: timeout + 1000, // Add buffer for network time
                }
            );

            return {
                success: !response.data.run?.stderr && response.data.run?.code === 0,
                stdout: response.data.run?.stdout || '',
                stderr: response.data.run?.stderr || '',
                compileOutput: response.data.compile?.output || '',
                executionTime: response.data.run?.signal || null,
                language,
                version,
            };
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    stdout: '',
                    stderr: 'Execution timeout exceeded',
                    error: 'TIMEOUT',
                    executionTime: timeout,
                };
            }

            throw new Error(`Piston API Error: ${error.message}`);
        }
    }

    /**
     * Get available language runtimes from Piston
     * @returns {Promise<Array>} List of available runtimes
     */
    async getRuntimes() {
        try {
            const response = await axios.get(`${PISTON_API_URL}/runtimes`, {
                timeout: 5000,
            });

            return response.data.map((runtime) => ({
                language: runtime.language,
                version: runtime.version,
                aliases: runtime.aliases || [],
            }));
        } catch (error) {
            throw new Error(`Failed to fetch Piston runtimes: ${error.message}`);
        }
    }

    /**
     * Get file extension for a given language
     * @param {string} language - Language identifier
     * @returns {string} File extension
     */
    getFileExtension(language) {
        const extensions = {
            javascript: 'js',
            python: 'py',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            go: 'go',
            rust: 'rs',
            typescript: 'ts',
            ruby: 'rb',
            php: 'php',
            csharp: 'cs',
            swift: 'swift',
            kotlin: 'kt',
        };

        return extensions[language] || 'txt';
    }

    /**
     * Validate code against test cases
     * @param {string} language - Language identifier
     * @param {string} version - Language version
     * @param {string} code - Source code
     * @param {Array} testCases - Array of test cases with input and expected output
     * @returns {Promise<Object>} Test results
     */
    async validateTestCases(language, version, code, testCases) {
        const results = [];
        let passedCount = 0;

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const result = await this.executeCode(
                language,
                version,
                code,
                testCase.input
            );

            const output = result.stdout.trim();
            const expected = testCase.expected.trim();
            const passed = output === expected;

            if (passed) passedCount++;

            results.push({
                testCase: i + 1,
                input: testCase.input,
                expected,
                actual: output,
                passed,
                error: result.stderr,
            });
        }

        return {
            totalTests: testCases.length,
            passedTests: passedCount,
            failedTests: testCases.length - passedCount,
            allPassed: passedCount === testCases.length,
            results,
        };
    }
}

module.exports = new PistonService();
