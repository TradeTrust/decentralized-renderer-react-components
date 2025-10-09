import React, { FunctionComponent, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Renderer } from "../../types";
import { repeat } from "../../utils";

// To import pdf.worker.js https://github.com/wojtekmaj/react-pdf/blob/v7.x/packages/react-pdf/README.md#use-external-cdn
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/**
 * Component rendering pdf attachments. Uses [react-pdf](http://projects.wojtekmaj.pl/react-pdf/) under the hood.
 */
// Helper function to validate base64 data
const isValidBase64 = (str: string): boolean => {
  try {
    // Check if string contains only valid base64 characters
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(str)) {
      return false;
    }
    // Try to decode to verify it's valid base64
    atob(str);
    return true;
  } catch {
    return false;
  }
};

const attachmentErrorIcon =
  "data:image/png;base64,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";

export const PdfRenderer: FunctionComponent<Renderer> = ({ attachment }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Validate base64 data on component mount
  React.useEffect(() => {
    if (!attachment.data || !isValidBase64(attachment.data)) {
      setError("The PDF file appears to be corrupted or invalid. Please contact the issuer.");
    }
  }, [attachment.data]);
  // Show error state if there's an error
  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          background: "rgba(247, 248, 252, 1)",
          border: "1px solid rgba(231, 234, 236, 1)",
          borderRadius: "8px",
          margin: "0 auto",
        }}
      >
        <img src={attachmentErrorIcon} alt="Crash Icon" style={{ width: "120px", height: "120px", margin: "0 auto" }} />
        <h3
          style={{
            fontFamily: "Gilroy",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "24px",
            margin: "15px 0",
          }}
        >
          Unable to Load Attachment
        </h3>
        <p
          style={{
            fontFamily: "Gilroy",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          The attachment file could not be read.
        </p>
      </div>
    );
  }

  return (
    <Document
      file={`data:application/pdf;base64,${attachment.data}`}
      loading={<div style={{ padding: "20px", textAlign: "center" }}>Loading PDF...</div>}
      error={<div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>Failed to load PDF</div>}
      onLoadSuccess={({ numPages }) => {
        setNumberOfPages(numPages);
        setError(null);
      }}
      onLoadError={(error) => {
        console.error("Error loading document", error);
        setError(`Failed to load PDF: ${error.message || "Unknown error"}`);
      }}
      onSourceError={(error) => {
        console.error("Error loading document source", error);
        setError(`PDF source error: ${error.message || "Invalid or corrupted PDF data"}`);
      }}
    >
      <style
        // TODO: The scoped attribute is deprecated and not supported by HTML5. May only be supported by Firefox.
        // eslint-disable-next-line react/no-unknown-property
        scoped
        dangerouslySetInnerHTML={{
          __html: `
      canvas {
        margin: auto;
      }
    `,
        }}
      />
      {repeat(numberOfPages)((index) => (
        // TODO: Dynamically resize width to fit container
        // https://github.com/wojtekmaj/react-pdf/issues/129
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
};
