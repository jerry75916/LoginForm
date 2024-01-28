import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import check and times icons
import { Button } from "../ui/button";
interface VerificationCodeInputProps {
  onVerificationChange: (isCorrect: boolean) => void;
}
const generateRandomCode = () => {
  const codeLength = 5;
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

const addNoiseToCanvas = (ctx: CanvasRenderingContext2D) => {
  if (ctx) {
    // 添加雜訊點
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * ctx.canvas.width;
      const y = Math.random() * ctx.canvas.height;
      ctx.fillStyle = "#000";
      ctx.fillRect(x, y, 1, 1);
    }

    // 添加雜訊線條
    for (let i = 0; i < 6; i++) {
      const x1 = Math.random() * ctx.canvas.width;
      const y1 = Math.random() * ctx.canvas.height;
      const x2 = Math.random() * ctx.canvas.width;
      const y2 = Math.random() * ctx.canvas.height;
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
};

const VerificationCodeInput = ({
  onVerificationChange,
}: VerificationCodeInputProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [verificationCode, setVerificationCode] = useState<string>(
    generateRandomCode()
  );
  const [userInput, setUserInput] = useState<string>("");
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false); // 是否已驗證成功?

  //draw code to canvas when code is changed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawCodeOnCanvas(ctx, verificationCode);
        addNoiseToCanvas(ctx);
      }
    }
  }, [verificationCode]);
  const getRandomFontFamily = () => {
    const fontFamilies = [
      "Arial",
      "Verdana",
      "Courier New",
      "Georgia",
      "Times New Roman",
      "Phosphate",
    ];
    return fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
  };

  const getRandomFontSize = () => {
    return Math.floor(Math.random() * 10) + 20; // 隨機生成 20 到 30 之間的字型大小
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]; //#000000 ~ #FFFFFF
    }
    return color;
  };
  const drawCodeOnCanvas = (ctx: CanvasRenderingContext2D, code: string) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < code.length; i++) {
      const x = 20 + i * 20; // 每個字之間的水平間距
      const y = 20 + Math.random() * 10; // 隨機垂直位置
      const color = getRandomColor(); // 隨機顏色
      const fontFamily = getRandomFontFamily(); // 隨機字體
      const fontSize = getRandomFontSize(); // 隨機字型大小

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.fillText(code.charAt(i), x, y);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    setUserInput(input);
    if (input === verificationCode) {
      onVerificationChange(true); //回給parent 更新submit button
      setIsMatch(true);
      setIsVerified(true); // 設定為已驗證成功
    } else {
      onVerificationChange(false);
      setIsMatch(false);
      setIsVerified(false); // 設定為未驗證成功
    }
  };

  const generateCodeAndDraw = () => {
    //重新產生code
    const code = generateRandomCode();
    setVerificationCode(code);
    setIsMatch(null);
    setIsVerified(false); // 當重新生成驗證時，設定為未驗證成功
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawCodeOnCanvas(ctx, code);
        addNoiseToCanvas(ctx);
      }
    }
  };

  return (
    <div className="flex">
      <div className="relative">
        <Input
          placeholder="Enter code"
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isVerified} // 當mtach時，不再讓user 輸入
          className={`border rounded px-3 py-2 focus:outline-none focus:border-blue-500`}
        />
        {isMatch === true && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FaCheck className="text-green-500" />
          </div>
        )}
        {isMatch === false && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FaTimes className="text-red-500" />
          </div>
        )}
      </div>
      <canvas
        className={isVerified ? "" : "cursor-pointer"}
        ref={canvasRef}
        width={150}
        height={40}
        onClick={isVerified ? undefined : generateCodeAndDraw} // 只有在未驗證成功時才可點擊轉換新的驗證碼
      ></canvas>
    </div>
  );
};

export default VerificationCodeInput;
