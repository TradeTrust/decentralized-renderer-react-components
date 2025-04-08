import React from "react";
import { TemplateProps, TemplateWithComponent } from "./types";
import { getTemplateUrl } from "./utils";
import NotificationBanner from "./components/NotificationBanner";

const container = {
  marginRight: "auto",
  marginLeft: "auto",
};

const textColor = `#333`;
const paddingBox = `.75rem 1.25rem`;

export const DefaultTemplate: React.FunctionComponent<TemplateProps<any>> = (props) => {
  return (
    <div id="default-template">
      <div style={{ ...container, ...{ color: textColor } }}>
        <NotificationBanner notificationType={props.errorType} templateURL={getTemplateUrl(props.document)} />
        <pre
          style={{
            backgroundColor: "#f7f8fc",
            padding: paddingBox,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {JSON.stringify(props.document, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const defaultTemplate: TemplateWithComponent<any> = {
  id: "default-template",
  label: "Default",
  template: DefaultTemplate,
};
