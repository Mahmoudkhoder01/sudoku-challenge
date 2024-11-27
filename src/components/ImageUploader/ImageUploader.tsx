import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createWorker } from "tesseract.js";
import { setBoard, setLockedCells } from "../../redux/BoardSlice";
import { FaUpload } from "react-icons/fa";
import "./ImageUploader.css";

const ImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [grid, setGrid] = useState<HTMLCanvasElement[][] | null>(null); // State for the 9x9 grid of canvases
  const dispatch = useDispatch();

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Split the uploaded image into a 9x9 grid of canvases
  const splitIntoGrid = (image: HTMLImageElement): HTMLCanvasElement[][] => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to get 2D context from canvas.");
    }

    // Set canvas dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0);

    const gridSize = 9; // 9x9 grid
    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;

    // Create an array to store cell canvases
    const grid: HTMLCanvasElement[][] = [];

    for (let row = 0; row < gridSize; row++) {
      const rowCells: HTMLCanvasElement[] = [];

      for (let col = 0; col < gridSize; col++) {
        // Create a new canvas for each cell
        const cellCanvas = document.createElement("canvas");
        const cellCtx = cellCanvas.getContext("2d");

        if (!cellCtx) {
          throw new Error("Unable to get 2D context from cell canvas.");
        }

        // Set the dimensions of the cell canvas
        cellCanvas.width = cellWidth;
        cellCanvas.height = cellHeight;

        // Extract the cell data from the main canvas
        const cellData = ctx.getImageData(
          col * cellWidth,
          row * cellHeight,
          cellWidth,
          cellHeight
        );

        // Draw the cell data onto the cell canvas
        cellCtx.putImageData(cellData, 0, 0);

        // Store the cell canvas in the row
        rowCells.push(cellCanvas);
      }

      // Add the row to the grid
      grid.push(rowCells);
    }

    return grid; // Returns a 9x9 array of canvases
  };

  /**
   * Extracts the first number found in a given string or value.
   * @param value - The value to process (string or other types).
   * @returns The extracted number or 0 if no number is found.
   */
  const extractNumber = (value: string): number => {
    // Match the first sequence of digits in the string
    const match = value.match(/\d+/);
    // If a number is found, parse it into an integer, otherwise return 0
    return match ? parseInt(match[0], 10) : 0;
  };

  // Process the image using OCR
  const processImageWithCanvas = async () => {
    if (!image) return;

    setStatus("Processing image...");
    const reader = new FileReader();

    reader.onload = async (e) => {
      const target = e.target as FileReader;
      if (!target.result) {
        console.error("Error: Image load failed");
        return;
      }

      const img = new Image();
      img.src = target.result as string;

      img.onload = async () => {
        // Split the image into a 9x9 grid of cells
        const grid = splitIntoGrid(img);

        // Set the grid state for visualization (optional)
        setGrid(grid);

        try {
          // Initialize the Tesseract.js worker
          const worker = createWorker("eng", 1);

          // Process each cell with OCR
          const newBoard: number[][] = [];
          const lockedCells: string[] = [];
          for (let row = 0; row < grid.length; row++) {
            const processedRow: number[] = [];
            for (let col = 0; col < grid[row].length; col++) {
              const cellCanvas = grid[row][col];
              const cellDataUrl = cellCanvas.toDataURL();
              const ret = await (await worker).recognize(cellDataUrl);

              // Process the text and extract numbers
              const text = ret.data.text.trim();

              // Log the OCR result for each cell
              console.log(
                `Cell [${row}, ${col}] OCR Text:`,
                ret.data.text.trim()
              );

              // Use the extractNumber function to get the number from the text
              const num = extractNumber(text);

              // Mark non-zero numbers as locked cells
              if (num > 0) {
                // Store the locked cells in "row-col" format
                lockedCells.push(`${row}-${col}`);
              }

              processedRow.push(num);
            }
            newBoard.push(processedRow);
          }

          await (await worker).terminate();

          // Dispatch actions to set the new board and locked cells
          dispatch(setBoard(newBoard)); // Set the new board
          dispatch(setLockedCells(lockedCells)); // Set the locked cells

          setStatus("Image processed successfully!");
        } catch (error) {
          console.error(error);
          setStatus("Error processing image. Please try again.");
        }
      };
    };

    reader.readAsDataURL(image);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        id="fileInput"
      />
      <button
        onClick={() => document.getElementById("fileInput")?.click()}
        className="uploadButton"
      >
        <FaUpload />
      </button>
      <p className="uploadText">Upload Sudoku Image</p>

      {image && (
        <button onClick={processImageWithCanvas} className="processText">
          Process and Solve
        </button>
      )}

      {grid && (
        <div style={{ marginTop: "20px" }}>
          <h3>9x9 Grid Preview:</h3>
          <table style={{ margin: "auto", borderCollapse: "collapse" }}>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cellCanvas, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ border: "1px solid black", padding: "2px" }}
                  >
                    <img
                      src={cellCanvas.toDataURL()}
                      alt={`Cell ${rowIndex}-${colIndex}`}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      )}

      <p>{status}</p>
    </div>
  );
};

export default ImageUploader;
