interface ResultCard {
  title: string;
  university: string;
  url: string;
  value: number;
  scale: string;
  items: Array<{ label: string; value: string }>;
}

/** Render locally: no student results or image uploads leave the browser. */
export async function downloadResultCard(result: ResultCard) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, 1200, 1000);
  const gradient = ctx.createLinearGradient(0, 0, 1200, 1000);
  gradient.addColorStop(0, "#065f46");
  gradient.addColorStop(1, "#312e81");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 14);
  const line = (text: string, y: number, size: number, color: string, weight = 400) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Arial, sans-serif`;
    ctx.fillText(text, 80, y, 1040);
  };
  line("MY SEMESTER. MY PROGRESS.", 95, 24, "#6ee7b7", 700);
  line(result.university, 162, 34, "#ffffff", 700);
  line(result.title, 252, 30, "#cbd5e1");
  line(`${result.value.toFixed(2)} / ${result.scale}`, 420, 128, "#6ee7b7", 700);
  ctx.fillStyle = "#334155";
  ctx.fillRect(80, 474, 1040, 2);
  result.items.forEach((item, index) => {
    line(item.label, 545 + index * 80, 25, "#94a3b8");
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 30px Arial, sans-serif";
    ctx.fillText(item.value, 1120, 545 + index * 80, 360);
    ctx.textAlign = "left";
  });
  line("Calculated estimate • Not an official transcript", 830, 23, "#94a3b8");
  line(result.url, 890, 21, "#cbd5e1");
  line("GPA & CGPA Calculator", 946, 23, "#6ee7b7", 700);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Image export failed")), "image/png"));
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${result.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-result.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
