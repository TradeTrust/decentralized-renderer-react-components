import React from "react";
import { render, waitFor } from "@testing-library/react";
import { PdfRenderer } from "./PdfRenderer";

// Mock react-pdf to simulate different scenarios
jest.mock(
  "react-pdf",
  (): {
    Document: React.ComponentType<any>;
    Page: React.ComponentType<any>;
    pdfjs: any;
  } => ({
    Document: ({ children, onSourceError }: any) => {
      // Simulate error for corrupted data
      if (onSourceError) {
        setTimeout(() => {
          onSourceError(new Error("Invalid or corrupted PDF data"));
        }, 0);
      }
      return <div data-testid="pdf-document">{children}</div>;
    },
    Page: ({ pageNumber }: any) => <div data-testid={`pdf-page-${pageNumber}`}>Page {pageNumber}</div>,
    pdfjs: {
      version: "3.0.0",
      GlobalWorkerOptions: {
        workerSrc: "",
        workerPort: undefined,
      },
    },
  }),
);

describe("component PdfRenderer", () => {
  it("should show error message for invalid base64 data like 'BASE64_ENCODED_FILE'", async () => {
    const { getByText } = render(
      <PdfRenderer attachment={{ type: "application/pdf", data: "BASE64_ENCODED_FILE", filename: "test.pdf" }} />,
    );

    await waitFor(() => {
      expect(getByText("Error Loading PDF")).toBeDefined();
      expect(getByText("The PDF file appears to be corrupted or invalid. Please contact the issuer.")).toBeDefined();
    });
  });

  it("should show error message for empty data", async () => {
    const { getByText } = render(
      <PdfRenderer attachment={{ type: "application/pdf", data: "", filename: "test.pdf" }} />,
    );

    await waitFor(() => {
      expect(getByText("Error Loading PDF")).toBeDefined();
      expect(getByText("The PDF file appears to be corrupted or invalid. Please contact the issuer.")).toBeDefined();
    });
  });

  it("should show error message for invalid base64 characters", async () => {
    const { getByText } = render(
      <PdfRenderer attachment={{ type: "application/pdf", data: "invalid!@#$%characters", filename: "test.pdf" }} />,
    );

    await waitFor(() => {
      expect(getByText("Error Loading PDF")).toBeDefined();
      expect(getByText("The PDF file appears to be corrupted or invalid. Please contact the issuer.")).toBeDefined();
    });
  });
});
