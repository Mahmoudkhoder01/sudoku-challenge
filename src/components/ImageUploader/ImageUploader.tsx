import React, { SetStateAction, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createWorker } from "tesseract.js";
import { setBoard, setFullBoard, setLockedCells } from "../../redux/BoardSlice";
import { FaUpload } from "react-icons/fa";
import "./ImageUploader.css";
import { solveSudoku } from "../../Functions/sudoku";
import { AlertStates } from "../../Game";

interface ImageUploaderProps {
  setAlert: React.Dispatch<SetStateAction<AlertStates | null>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setAlert }) => {
  // State to store the uploaded image file
  const [image, setImage] = useState<File | null>(null);

  // State to store the current status of image processing (e.g., success, error, or progress message)
  const [status, setStatus] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initializes the Redux `dispatch` function for dispatching actions to the Redux store
  const dispatch = useDispatch();

  /**
   * Handles the image upload event triggered when the user selects an image file.
   * @param e - The change event from the file input element.
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if a file is selected
    if (e.target.files && e.target.files[0]) {
      // Update the `image` state with the selected file
      setImage(e.target.files[0]);

      setStatus("");
    }
  };

  /**
   * Splits a given image into a 9x9 grid of canvas cells, applying a threshold to enhance contrast
   * for better OCR (Optical Character Recognition) processing.
   * @param image - The HTMLImageElement to be processed.
   * @returns A 2D array (9x9) of HTMLCanvasElement objects representing each cell in the grid.
   */
  const splitIntoGrid = (image: HTMLImageElement): HTMLCanvasElement[][] => {
    // Create a main canvas to manipulate the uploaded image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Ensure the 2D context is available; throw an error otherwise
    if (!ctx) {
      throw new Error("Unable to get 2D context from canvas.");
    }

    // Set the dimensions of the main canvas to match the image dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the original image onto the main canvas
    ctx.drawImage(image, 0, 0);

    // Extract the image data (pixels) from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data; // Pixel data in RGBA format

    // Process each pixel in the image to apply a black-and-white threshold
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]; // Red channel
      const g = pixels[i + 1]; // Green channel
      const b = pixels[i + 2]; // Blue channel

      // Calculate brightness using the luminance formula for weighted averages
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      // If brightness is below a certain threshold, set the pixel to black
      if (brightness < 128) {
        pixels[i] = 0; // Red
        pixels[i + 1] = 0; // Green
        pixels[i + 2] = 0; // Blue
      } else {
        // Otherwise, set the pixel to white (optional, for noise reduction)
        pixels[i] = 255; // Red
        pixels[i + 1] = 255; // Green
        pixels[i + 2] = 255; // Blue
      }
    }

    // Update the main canvas with the modified image data
    ctx.putImageData(imageData, 0, 0);

    // Define the grid size (9x9 for Sudoku puzzles)
    const gridSize = 9;
    const cellWidth = canvas.width / gridSize; // Width of each cell
    const cellHeight = canvas.height / gridSize; // Height of each cell

    // Initialize a 2D array to store the grid of cell canvases
    const grid: HTMLCanvasElement[][] = [];

    // Loop through the rows and columns to split the image into 81 cells
    for (let row = 0; row < gridSize; row++) {
      const rowCells: HTMLCanvasElement[] = []; // Array to store canvases for the current row

      for (let col = 0; col < gridSize; col++) {
        // Create a new canvas for each individual cell
        const cellCanvas = document.createElement("canvas");
        const cellCtx = cellCanvas.getContext("2d");

        // Ensure the 2D context is available for the cell canvas
        if (!cellCtx) {
          throw new Error("Unable to get 2D context from cell canvas.");
        }

        // Set the dimensions of the cell canvas
        cellCanvas.width = cellWidth;
        cellCanvas.height = cellHeight;

        // Extract the image data for the current cell from the main canvas
        const cellData = ctx.getImageData(
          col * cellWidth, // X-coordinate of the top-left corner of the cell
          row * cellHeight, // Y-coordinate of the top-left corner of the cell
          cellWidth, // Width of the cell
          cellHeight // Height of the cell
        );

        // Draw the cell image data onto the cell canvas
        cellCtx.putImageData(cellData, 0, 0);

        // Add the cell canvas to the current row
        rowCells.push(cellCanvas);
      }

      // Add the row of cell canvases to the grid
      grid.push(rowCells);
    }

    // Return the 9x9 grid of canvases
    return grid;
  };

  /**
   * Extracts the first number between 1 and 9 found in a given string or value.
   * @param value - The value to process (string or other types).
   * @returns The extracted number between 1 and 9, or 0 if no number is found.
   */
  const extractNumber = (value: string): number => {
    // Match the first single-digit number between 1 and 9
    const match = value.match(/[1-9]/);

    // If a number is found, return it as an integer, otherwise return 0
    return match ? parseInt(match[0], 10) : 0;
  };

  /**
   * Processes an uploaded image, splits it into a 9x9 grid, and uses OCR (Tesseract.js)
   * to extract numbers for Sudoku puzzle generation. Updates the Redux state with the board
   * and locked cells while providing status updates.
   */
  const processImageWithCanvas = async () => {
    // Check if an image is uploaded; if not, exit early
    if (!image) return;

    // Update the UI to show that the image is being processed
    setStatus("Processing image...");

    // Use FileReader to read the uploaded image file as a data URL
    const reader = new FileReader();

    reader.onload = async (e) => {
      // Extract the result from the FileReader
      const target = e.target as FileReader;
      if (!target.result) {
        console.error("Error: Image load failed");
        return;
      }

      // Create a new Image object and set its source to the uploaded image
      const img = new Image();
      img.src = target.result as string;

      // Wait until the image is fully loaded
      img.onload = async () => {
        // Step 1: Split the loaded image into a 9x9 grid of cell canvases
        const grid = splitIntoGrid(img);

        try {
          // Step 2: Initialize the Tesseract.js worker for OCR processing
          const worker = createWorker("eng", 1); // Create a worker with English language and concurrency level 1

          // Initialize arrays to store the processed Sudoku board and locked cells
          const newBoard: number[][] = [];
          const lockedCells: string[] = [];

          // Step 3: Iterate over each row of the grid
          for (let row = 0; row < grid.length; row++) {
            const processedRow: number[] = []; // Temporary array for the current row

            // Iterate over each column of the grid
            for (let col = 0; col < grid[row].length; col++) {
              const cellCanvas = grid[row][col]; // Canvas of the current cell
              const cellDataUrl = cellCanvas.toDataURL(); // Convert the cell canvas to a Base64 URL

              // Use the OCR worker to recognize text in the current cell
              const ret = await (await worker).recognize(cellDataUrl, {}, {});

              // Extract and trim the recognized text
              const text = ret.data.text.trim();

              // Use the extractNumber utility function to parse the recognized text into a number
              const num = extractNumber(text);

              // If the recognized number is greater than zero, mark it as a locked cell
              if (num > 0) {
                lockedCells.push(`${row}-${col}`); // Store locked cells as "row-col"
              }

              processedRow.push(num); // Add the number to the current row
            }

            newBoard.push(processedRow); // Add the processed row to the board
          }

          // Step 4: Terminate the Tesseract.js worker to free up resources
          await (await worker).terminate();

          const newFullBoard = JSON.parse(JSON.stringify(newBoard)); // Deep copy to modify

          const board: number[][] | [] = solveSudoku(newFullBoard);

          if (board.length === 0) {
            setAlert({
              type: "error",
              message:
                "The uploaded image is unclear or doesn't have a solution. Ensure the Sudoku table is 100% filled, cropped perfectly, and contains only the Sudoku grid (no extra borders or elements). Or try a different board",
            });

            setStatus("");

            setImage(null);

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            return;
          }

          // Step 5: Dispatch actions to update the Redux state with the board and locked cells
          dispatch(setBoard(newBoard)); // Update the board in the Redux store

          dispatch(setLockedCells(lockedCells)); // Update the locked cells in the Redux store

          dispatch(setFullBoard(board)); // Update the full board in the Redux store

          // Update the status to indicate successful processing
          setStatus("Image processed successfully!");
        } catch (error) {
          // Handle errors during OCR or processing
          console.error(error);
          setAlert({
            type: "error",
            message: "Error processing image. Please try again.",
          });

          setImage(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          setStatus("");
        }
      };

      img.onerror = () => {
        console.error("Error: Failed to load image.");
        setAlert({
          type: "error",
          message: "Failed to load image. Please upload a valid image",
        });

        setImage(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setStatus("");
      };
    };

    reader.onerror = () => {
      console.error("Error: Failed to read the file.");

      setAlert({
        type: "error",
        message: "Error: Failed to read the file. Please try again.",
      });

      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setStatus("");
    };

    // Read the uploaded image file as a Data URL (Base64 encoding)
    reader.readAsDataURL(image);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* File input for uploading an image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        ref={fileInputRef}
        id="fileInput"
      />

      {/* Button to trigger the hidden file input */}
      <button
        onClick={() => document.getElementById("fileInput")?.click()}
        className="uploadButton"
      >
        <FaUpload />
      </button>

      {/* Instructional text below the upload button */}
      <p className="uploadText">Upload Sudoku Image</p>

      {/* Display image details and processing options only if an image is uploaded */}
      {image && (
        <>
          {/* Display the name of the uploaded image */}
          <div className="image_name">{image.name}</div>

          {/* Button to start the image processing */}
          <button onClick={processImageWithCanvas} className="processText">
            Process and Solve
          </button>
        </>
      )}

      {/* Display the current status of image processing */}
      <p className="image_process_status">{status}</p>
    </div>
  );
};

export default ImageUploader;
