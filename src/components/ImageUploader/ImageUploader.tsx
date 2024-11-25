import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Tesseract from "tesseract.js";
import { setBoard } from "../../redux/BoardSlice";
import { FaUpload } from "react-icons/fa";
import "./ImageUploader.css";

const ImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const dispatch = useDispatch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

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
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = gray;
        }

        ctx.putImageData(imageData, 0, 0);

        const imgDataUrl = canvas.toDataURL();
        try {
          const { data } = await Tesseract.recognize(imgDataUrl, "eng", {
            logger: (m) => console.log(m),
          });

          console.log("Extracted Text:", data.text);

          // Process the text with consideration for cell positions
          const board = preprocessExtractedText(data.text);
          dispatch(setBoard(board));

          setStatus("Image processed successfully!");
        } catch (error) {
          console.error(error);
          setStatus("Error processing image. Please try again.");
        }
      };
    };

    reader.readAsDataURL(image);
  };

  const preprocessExtractedText = (text: string): number[][] => {
    // Split the text into rows and remove empty lines
    const rows = text.split("\n").filter((row) => row.trim() !== "");

    // Process each row to ensure proper cell counting
    const board = rows.map((row) => {
      // First, normalize the row text by replacing multiple spaces with single spaces
      const normalizedRow = row.trim().replace(/\s+/g, " ");

      // Split the row into cells, preserving empty spaces
      const cells = normalizedRow.split(" ");

      // Calculate the expected positions of numbers based on the cell width
      const cellWidth = Math.ceil(normalizedRow.length / 9);

      // Create an array to store the processed row
      const processedRow: number[] = Array(9).fill(0);

      // Map the detected numbers to their correct positions
      cells.forEach((cell, index) => {
        if (/\d/.test(cell)) {
          const number = parseInt(cell, 10);
          if (!isNaN(number) && number >= 1 && number <= 9) {
            // Calculate the position based on the cell's position in the original text
            const position = Math.min(
              Math.floor(index * (9 / cells.length)),
              8
            );
            processedRow[position] = number;
          }
        }
      });

      return processedRow;
    });

    // Ensure we have exactly 9 rows
    while (board.length < 9) {
      board.push(Array(9).fill(0));
    }

    // Trim to exactly 9 rows if we have more
    return board.slice(0, 9);
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
      <p>{status}</p>
    </div>
  );
};

export default ImageUploader;
