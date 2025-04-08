import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import styles from "./Reponse.module.css";

export default function Response() {
  const location = useLocation();
  const { text } = location.state || { text: "No content provided" };

  const isSectionHeading = (line: string, index: number, _lines: string[]) => {
    const trimmedLine = line.trim();
    const commonHeadings = [
      "skills",
      "experience",
      "education",
      "languages",
      "summary",
      "projects",
      "certifications",
    ];
    const isShortLine = trimmedLine.split(" ").length <= 3;
    const isHeadingText = commonHeadings.some((h) =>
      trimmedLine.toLowerCase().includes(h)
    );
    const isBoldMarked = trimmedLine.startsWith("**") && trimmedLine.endsWith("**");
    const isNotContactInfo = index > 2;
    const isNotBullet = !trimmedLine.startsWith("*");
    return (
      (isBoldMarked || (isShortLine && isHeadingText)) &&
      isNotContactInfo &&
      isNotBullet
    );
  };

  const isSubheading = (line: string, prevLine: string) => {
    const trimmedLine = line.trim();
    return (
      trimmedLine.length > 0 &&
      !trimmedLine.startsWith("*") &&
      !isSectionHeading(trimmedLine, 0, [trimmedLine]) &&
      prevLine.trim() !== ""
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const leftMargin = 15;
    const rightMargin = 15;
    const pageWidth = 210 - leftMargin - rightMargin;
    const pageHeight = 297;
    let yPosition = 15;

    let cleanText = text.replace(/```text|```/g, "").trim();
    const lines = cleanText.split("\n").filter((line: string) => line.trim() !== "");

    lines.forEach((line: string, index: number) => {
      const trimmedLine = line.trim();
      const prevLine = index > 0 ? lines[index - 1] : "";

      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 15;
      }

      if (index === 0) {
        // Name (first line)
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const splitText = doc.splitTextToSize(trimmedLine, pageWidth);
        doc.text(splitText, leftMargin, yPosition);
        yPosition += splitText.length * 6 + 10; // Gap after name
      } else if (isSectionHeading(trimmedLine, index, lines)) {
        // Section Heading (e.g., Skills, Education)
        const headerText = trimmedLine.replace(/\*\*/g, "").trim();
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const splitText = doc.splitTextToSize(headerText, pageWidth);
        doc.text(splitText, leftMargin, yPosition);
        yPosition += splitText.length * 5 + 10; // Increased gap after section heading (was +5, now +10)
      } else if (isSubheading(trimmedLine, prevLine)) {
        // Subheading
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const splitText = doc.splitTextToSize(trimmedLine, pageWidth);
        doc.text(splitText, leftMargin, yPosition);
        yPosition += splitText.length * 4 + 2;
      } else if (trimmedLine.startsWith("*")) {
        // Bullet Points
        const bulletText = trimmedLine.slice(1).trim();
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(`- ${bulletText}`, pageWidth);
        doc.text(splitText, leftMargin, yPosition);
        yPosition += splitText.length * 4 + 2;
      } else {
        // Regular Text
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(trimmedLine, pageWidth);
        doc.text(splitText, leftMargin, yPosition);
        yPosition += splitText.length * 4 + 2;
      }
    });

    doc.save("ATS-Resume.pdf");
  };

  const displayText = text.replace(/```text|```/g, "").trim();

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Resume Preview</h1>
      <div className={styles.content}>
        {displayText.split("\n").map((line: string, index: number) => {
          const trimmedLine = line.trim();
          const prevLine = index > 0 ? displayText.split("\n")[index - 1] : "";

          if (index === 0) {
            return (
              <h1 key={index} className={styles.name}>
                {trimmedLine}
              </h1>
            );
          } else if (isSectionHeading(trimmedLine, index, displayText.split("\n"))) {
            return (
              <h2 key={index} className={styles.sectionHeader}>
                {trimmedLine.replace(/\*\*/g, "")}
              </h2>
            );
          } else if (isSubheading(trimmedLine, prevLine)) {
            return (
              <h3 key={index} className={styles.subheader}>
                {trimmedLine}
              </h3>
            );
          } else if (trimmedLine.startsWith("*")) {
            return (
              <p key={index} className={styles.bullet}>
                • {trimmedLine.slice(1).trim()}
              </p>
            );
          } else if (trimmedLine) {
            return (
              <p key={index} className={styles.text}>
                {trimmedLine}
              </p>
            );
          }
          return null;
        })}
      </div>
      <button className={styles.button} onClick={generatePDF}>
        Download PDF
      </button>
    </div>
  );
}