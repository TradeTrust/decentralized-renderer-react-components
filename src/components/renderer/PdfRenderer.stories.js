import { SAMPLE_PDF } from "./fixtures/pdf";
import { PdfRenderer } from "./PdfRenderer";

export default {
  title: "PdfRenderer",
  component: PdfRenderer,
  argTypes: {
    attachment: {
      table: {
        disable: true,
      },
    },
  },
};

export const BasicExample = {
  args: {
    attachment: {
      data: SAMPLE_PDF,
      type: "application/pdf",
      filename: "sample.pdf",
    },
  },
  name: "basic example",
};

// Error scenarios to demonstrate error handling
export const InvalidBase64Data = {
  args: {
    attachment: {
      data: "BASE64_ENCODED_FILE", // Invalid base64 that triggers validation error
      type: "application/pdf",
      filename: "invalid.pdf",
    },
  },
  name: "invalid base64 data",
};

export const EmptyData = {
  args: {
    attachment: {
      data: "", // Empty data triggers validation error
      type: "application/pdf",
      filename: "empty.pdf",
    },
  },
  name: "empty data",
};
