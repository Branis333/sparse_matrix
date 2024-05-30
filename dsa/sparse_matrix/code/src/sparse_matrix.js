const fs = require('fs');
const path = require('path');

class SparseMatrix {
    constructor(filePath = null, numRows = null, numCols = null) {
        this.matrix = {};
        if (filePath) {
            console.log(`Loading matrix from file: ${path.resolve(filePath)}`);
            this.loadFromFile(filePath);
        } else if (numRows !== null && numCols !== null) {
            this.numRows = numRows;
            this.numCols = numCols;
        } else {
            throw new Error("Either filePath or both numRows and numCols must be provided");
        }
    }

    loadFromFile(filePath) {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.trim().split('\n').map(line => line.trim());

        this.numRows = parseInt(lines[0].split('=')[1]);
        this.numCols = parseInt(lines[1].split('=')[1]);

        console.log(`Matrix dimensions: ${this.numRows}x${this.numCols}`);

        for (let i = 2; i < lines.length; i++) {
            const line = lines[i];
            if (line) {
                const match = line.match(/\((\d+),\s*(\d+),\s*(-?\d+)\)/);
                if (!match) {
                    throw new Error("Input file has wrong format");
                }
                const [_, row, col, value] = match.map(Number);
                console.log(`Setting element [${row}, ${col}] = ${value}`);
                this.setElement(row, col, value);
            }
        }
    }

    getElement(row, col) {
        return this.matrix[`${row},${col}`] || 0;
    }

    setElement(row, col, value) {
        if (value !== 0) {
            this.matrix[`${row},${col}`] = value;
        } else {
            delete this.matrix[`${row},${col}`];
        }
    }

    add(other) {
        if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
            throw new Error("Matrix dimensions must match for addition");
        }
        const result = new SparseMatrix(null, this.numRows, this.numCols);
        const keys = new Set([...Object.keys(this.matrix), ...Object.keys(other.matrix)]);
        keys.forEach(key => {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) + other.getElement(row, col));
        });
        return result;
    }

    subtract(other) {
        if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
            throw new Error("Matrix dimensions must match for subtraction");
        }
        const result = new SparseMatrix(null, this.numRows, this.numCols);
        const keys = new Set([...Object.keys(this.matrix), ...Object.keys(other.matrix)]);
        keys.forEach(key => {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) - other.getElement(row, col));
        });
        return result;
    }

    multiply(other) {
        console.log(`Matrix 1 dimensions: ${this.numRows}x${this.numCols}`);
        console.log(`Matrix 2 dimensions: ${other.numRows}x${other.numCols}`);
        if (this.numCols !== other.numRows) {
            throw new Error("Matrix dimensions must be compatible for multiplication");
        }
        const result = new SparseMatrix(null, this.numRows, other.numCols);
        for (let key of Object.keys(this.matrix)) {
            const [i, k] = key.split(',').map(Number);
            for (let j = 0; j < other.numCols; j++) {
                const value = result.getElement(i, j) + this.getElement(i, k) * other.getElement(k, j);
                result.setElement(i, j, value);
            }
        }
        return result;
    }

    toString() {
        let result = [];
        for (let i = 0; i < this.numRows; i++) {
            let row = [];
            for (let j = 0; j < this.numCols; j++) {
                row.push(this.getElement(i, j));
            }
            result.push(row.join(' '));
        }
        return result.join('\n');
    }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error("Usage: node sparse_matrix.js <matrix1_file> <matrix2_file>");
        process.exit(1);
    }
    
    const [file1, file2] = args;

    const matrix1 = new SparseMatrix(file1);
    const matrix2 = new SparseMatrix(file2);
    
    console.log("Matrix 1:");
    console.log(matrix1.toString());
    console.log("\nMatrix 2:");
    console.log(matrix2.toString());
    
    try {
        const addedMatrix = matrix1.add(matrix2);
        console.log("\nAdded Matrix:");
        console.log(addedMatrix.toString());
    } catch (error) {
        console.error("\nAddition Error:", error.message);
    }
    
    try {
        const subtractedMatrix = matrix1.subtract(matrix2);
        console.log("\nSubtracted Matrix:");
        console.log(subtractedMatrix.toString());
    } catch (error) {
        console.error("\nSubtraction Error:", error.message);
    }
    
    try {
        const multipliedMatrix = matrix1.multiply(matrix2);
        console.log("\nMultiplied Matrix:");
        console.log(multipliedMatrix.toString());
    } catch (error) {
        console.error("\nMultiplication Error:", error.message);
    }
}

