import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Tesseract from "tesseract.js";
import { setBoard } from "../../redux/BoardSlice";

const ImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);

  const [status, setStatus] = useState<string>("");

  const dispatch = useDispatch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const parseSudokuFromText = (text: string): number[][] => {
    // Split text into rows, filtering out empty lines
    const rows = text.split("\n").filter((row) => row.trim() !== "");

    // Parse each row into an array of exactly 9 numbers, replacing spaces or non-digits with 0
    const board = rows.map((row) => {
      const cells = row.match(/\d| /g) || []; // Match digits or spaces

      // Map to a row of exactly 9 cells, replacing spaces with 0
      return Array(9)
        .fill(0)
        .map((_, idx) => {
          const cell = cells[idx];
          return cell === " " || !cell ? 0 : parseInt(cell, 10);
        });
    });

    // Ensure the board has exactly 9 rows, filling missing rows with zeros
    while (board.length < 9) {
      board.push(Array(9).fill(0));
    }

    return board;
  };

  const processImage = async () => {
    if (!image) return;

    setStatus("Processing image...");
    const reader = new FileReader();

    reader.onload = async () => {
      const imgData = reader.result;

      if (typeof imgData === "string") {
        try {
          // Perform OCR
          const { data } = await Tesseract.recognize(imgData, "eng", {
            logger: (m) => console.log(m), // Log OCR progress
          });
          console.log("board uploaded", data.text);

          const board = parseSudokuFromText(data.text);

          dispatch(setBoard(board));

          setStatus("Image processed successfully!");
        } catch (error) {
          console.error(error);
          setStatus("Error processing image. Please try again.");
        }
      }
    };

    reader.readAsDataURL(image);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <button onClick={processImage}>Process and Solve</button>}
      <p>{status}</p>
    </div>
  );
};

export default ImageUploader;
