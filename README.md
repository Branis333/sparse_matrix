# Sparse Matrix Operations

This project implements a data structure for efficiently storing and performing operations on sparse matrices. Supported operations include addition, subtraction, and multiplication.

## Directory Structure

```
/dsa/sparse_matrix/
├── code/
│   └── src/
│       ├── main.cpp
│       ├── SparseMatrix.h
│       └── SparseMatrix.cpp
└── sample_inputs/
    ├── matrix1.txt
    ├── matrix2.txt
    └── result.txt
```

## Input File Format

```
rows=<number_of_rows>
cols=<number_of_columns>
(row_index, col_index, value)
```

### Example

```
rows=3
cols=3
(0, 0, 1)
(1, 1, 2)
(2, 2, 3)
```

## Functions

### Constructors

- `SparseMatrix(const std::string &matrixFilePath)`
- `SparseMatrix(int numRows, int numCols)`

### Methods

- `int getElement(int currRow, int currCol) const`
- `void setElement(int currRow, int currCol, int value)`
- `SparseMatrix add(const SparseMatrix &other) const`
- `SparseMatrix subtract(const SparseMatrix &other) const`
- `SparseMatrix multiply(const SparseMatrix &other) const`

## Usage

1. Place input files in `sample_inputs`.
2. Compile:
    ```
    g++ -o sparse_matrix src/*.cpp
    ```
3. Run:
    ```
    ./sparse_matrix ../../sample_inputs/easy_sample_01_1.txt ../../sample_inputs/easy_sample_01_1.txt
    ```

## Error Handling

- Ignores whitespaces.
- Throws `std::invalid_argument("Input file has wrong format")` for incorrect formatting.

## License

MIT License

## Author

Your Name (b.sumba@alustudent.com)

