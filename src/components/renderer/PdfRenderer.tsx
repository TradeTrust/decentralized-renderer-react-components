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
export const PdfRenderer: FunctionComponent<Renderer> = ({ attachment }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);

  return (
    <Document
      file={`data:application/pdf;base64,${attachment.data}`}
      onLoadSuccess={({ numPages }) => {
        setNumberOfPages(numPages);
      }}
      onLoadError={(error) => {
        console.error("Error loading document", error);
      }}
      onSourceError={(error) => {
        console.error("Error loading document source", error);
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
