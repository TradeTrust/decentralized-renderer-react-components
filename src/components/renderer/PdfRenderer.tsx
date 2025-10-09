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
        }}
      >
        <img src={require("./attachment-error.png")} alt="Crash Icon" style={{ width: "120px", height: "120px" }} />
        <h3
          style={{
            fontFamily: "Gilroy",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "24px",
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
