import katex from "katex";
import "katex/dist/katex.min.css";

function normalizeMath(math = "") {
  return math
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderKatex(math, displayMode = false) {
  try {
    const safeMath = normalizeMath(math);
    return katex.renderToString(safeMath, {
      throwOnError: false,
      displayMode,
      strict: "ignore",
    });
  } catch {
    return math;
  }
}
function parseQuestionContent(content = "") {
  const result = [];
  let i = 0;

  while (i < content.length) {
    // 1. BLOCK: $$...$$
    if (content.startsWith("$$", i)) {
      const end = content.indexOf("$$", i + 2);

      if (end !== -1) {
        result.push({
          type: "block",
          value: content.slice(i + 2, end).trim(),
        });
        i = end + 2;
        continue;
      } else {
        // không có đóng → coi như text
        result.push({ type: "text", value: "$$" });
        i += 2;
        continue;
      }
    }

    // 2. INLINE: $...$
    if (content[i] === "$") {
      const end = content.indexOf("$", i + 1);

      if (end !== -1) {
        result.push({
          type: "inline",
          value: content.slice(i + 1, end).trim(),
        });
        i = end + 1;
        continue;
      } else {
        // không có đóng → coi như text
        result.push({ type: "text", value: "$" });
        i += 1;
        continue;
      }
    }

    // 3. TEXT thường
    let nextDollar = content.indexOf("$", i);

    if (nextDollar === -1) {
      // không còn $ nữa → lấy hết phần còn lại
      result.push({
        type: "text",
        value: content.slice(i),
      });
      break;
    }

    if (nextDollar > i) {
      result.push({
        type: "text",
        value: content.slice(i, nextDollar),
      });
      i = nextDollar;
      continue;
    }

    // ⚠️ fallback an toàn (QUAN TRỌNG)
    i += 1;
  }

  return result;
}

export default function Preview({
  content = "",
  fontSize = "text-base",        // text-sm | text-base | text-lg | text-xl
  width = "w-full",              // w-full | w-[500px] | ...
  height = "h-auto",             // h-auto | h-40 | h-60 | ...
  minHeight = "",                // min-h-[100px]
  maxHeight = "",                // max-h-[400px]
  padding = "p-4",
  rounded = "rounded-lg",
  border = "border border-gray-200",
  bg = "bg-white",
  textColor = "text-gray-800",
  overflow = "overflow-auto",
  className = "",
  contentClassName = "",
}) {
  const parts = parseQuestionContent(content);

  return (
    <div
      className={[
        width,
        height,
        minHeight,
        maxHeight,
        padding,
        rounded,
        border,
        bg,
        overflow,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "leading-7 whitespace-pre-wrap",
          fontSize,
          textColor,
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {parts.map((part, index) => {
          if (part.type === "text") {
            return <span key={index}>{part.value}</span>;
          }

          if (part.type === "inline") {
            return (
              <span
                key={index}
                className="inline-block align-middle whitespace-nowrap"
                dangerouslySetInnerHTML={{
                  __html: renderKatex(part.value, false),
                }}
              />
            );
          }

          if (part.type === "block") {
            return (
              <div
                key={index}
                className="my-3 overflow-x-auto"
                dangerouslySetInnerHTML={{
                  __html: renderKatex(part.value, true),
                }}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}