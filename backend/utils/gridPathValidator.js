/**
 * Grid Path Validation Utility
 * Validates user-generated grid paths against expected solutions
 */

/**
 * Validates a grid path submission
 * @param {string} userOutput - The user's code output (should be JSON stringified array)
 * @param {Array} expectedPath - The expected path array [[row, col], ...]
 * @param {Object} gridSize - Grid dimensions {rows, cols}
 * @returns {Object} Validation result with success status and details
 */
function validateGridPath(userOutput, expectedPath, gridSize) {
    const result = {
        success: false,
        message: '',
        details: {},
        userPath: null,
        mismatchIndex: -1
    };

    // Step 1: Parse user output
    try {
        result.userPath = JSON.parse(userOutput.trim());
    } catch (error) {
        result.message = 'Invalid output format. Expected a JSON array of positions.';
        result.details.error = 'JSON_PARSE_ERROR';
        result.details.hint = 'Make sure to output your path using console.log(JSON.stringify(path))';
        return result;
    }

    // Step 2: Validate user path structure
    if (!Array.isArray(result.userPath)) {
        result.message = 'Output must be an array of positions.';
        result.details.error = 'NOT_ARRAY';
        return result;
    }

    if (result.userPath.length === 0) {
        result.message = 'Path cannot be empty.';
        result.details.error = 'EMPTY_PATH';
        return result;
    }

    // Step 3: Validate each position in user path
    for (let i = 0; i < result.userPath.length; i++) {
        const pos = result.userPath[i];

        if (!Array.isArray(pos) || pos.length !== 2) {
            result.message = `Invalid position at index ${i}. Each position must be [row, col].`;
            result.details.error = 'INVALID_POSITION_FORMAT';
            result.details.invalidIndex = i;
            return result;
        }

        const [row, col] = pos;

        if (!Number.isInteger(row) || !Number.isInteger(col)) {
            result.message = `Position at index ${i} contains non-integer values.`;
            result.details.error = 'NON_INTEGER_COORDINATES';
            result.details.invalidIndex = i;
            return result;
        }

        if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) {
            result.message = `Position [${row}, ${col}] at index ${i} is out of grid bounds.`;
            result.details.error = 'OUT_OF_BOUNDS';
            result.details.invalidIndex = i;
            result.details.position = [row, col];
            result.details.gridSize = gridSize;
            return result;
        }
    }

    // Step 4: Compare with expected path
    if (result.userPath.length !== expectedPath.length) {
        result.message = `Path length mismatch. Expected ${expectedPath.length} positions, got ${result.userPath.length}.`;
        result.details.error = 'LENGTH_MISMATCH';
        result.details.expectedLength = expectedPath.length;
        result.details.actualLength = result.userPath.length;
        return result;
    }

    // Step 5: Check each position matches
    for (let i = 0; i < expectedPath.length; i++) {
        const userPos = result.userPath[i];
        const expectedPos = expectedPath[i];

        if (userPos[0] !== expectedPos[0] || userPos[1] !== expectedPos[1]) {
            result.message = `Path diverges at step ${i}. Expected [${expectedPos[0]}, ${expectedPos[1]}], got [${userPos[0]}, ${userPos[1]}].`;
            result.details.error = 'PATH_MISMATCH';
            result.details.mismatchIndex = i;
            result.details.expectedPosition = expectedPos;
            result.details.actualPosition = userPos;
            result.mismatchIndex = i;
            return result;
        }
    }

    // Success!
    result.success = true;
    result.message = 'Perfect! Your path matches the expected solution.';
    result.details.pathLength = result.userPath.length;

    return result;
}

/**
 * Helper function to visualize path difference
 * @param {Array} userPath - User's path
 * @param {Array} expectedPath - Expected path
 * @param {number} mismatchIndex - Index where paths diverge
 * @returns {string} Human-readable path comparison
 */
function formatPathComparison(userPath, expectedPath, mismatchIndex) {
    const lines = [];
    const displayCount = Math.min(10, Math.max(userPath.length, expectedPath.length));

    lines.push('Path Comparison (first 10 steps):');
    lines.push('Step | Expected   | Your Path  | Status');
    lines.push('-----|------------|------------|-------');

    for (let i = 0; i < displayCount; i++) {
        const exp = expectedPath[i] ? `[${expectedPath[i][0]},${expectedPath[i][1]}]` : 'N/A';
        const usr = userPath[i] ? `[${userPath[i][0]},${userPath[i][1]}]` : 'N/A';
        const status = i === mismatchIndex ? '❌' : (i < mismatchIndex || mismatchIndex === -1) ? '✓' : '';

        lines.push(`${String(i).padStart(4)} | ${exp.padEnd(10)} | ${usr.padEnd(10)} | ${status}`);
    }

    if (Math.max(userPath.length, expectedPath.length) > 10) {
        lines.push('... (showing first 10 steps)');
    }

    return lines.join('\n');
}

module.exports = {
    validateGridPath,
    formatPathComparison
};
