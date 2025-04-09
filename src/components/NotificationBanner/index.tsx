import React from "react";

type NotificationType = {
  title: string;
  description: (url?: string) => React.ReactNode;
  icon: () => React.ReactNode;
  bgColor: string;
};

const notificationTypes: { [key: string]: NotificationType } = {
  MISSING_RENDERER_URL: {
    title: "Missing Renderer",
    description: () => (
      <>
        This document doesn&apos;t specify how to display itself. We&apos;re showing you the raw document data, which is
        still valid and verified.
      </>
    ),
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.5215 8.30118L18.6228 9.06112C18.8594 10.8425 18.5139 12.6526 17.6377 14.2216C16.7614 15.7905 15.4015 17.0341 13.7608 17.767C12.12 18.4999 10.2863 18.6828 8.53307 18.2884C6.77987 17.894 5.20113 16.9435 4.0323 15.5785C2.86348 14.2135 2.16719 12.5073 2.04729 10.7143C1.92739 8.92127 2.39031 7.13754 3.36699 5.6291C4.34367 4.12067 5.78179 2.96836 7.46687 2.34404C9.15195 1.71972 10.9937 1.65683 12.7174 2.16475"
          stroke="#FF8200"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="10.75"
          y1="5.39258"
          x2="10.75"
          y2="12.464"
          stroke="#FF8200"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10.5357" cy="15.1783" r="0.535714" fill="#FF8200" />
      </svg>
    ),
    bgColor: "#FFF7E2",
  },
  TIMEOUT: {
    title: "Problem Connecting to Renderer",
    description: (templateURL) => (
      <>
        We&apos;re showing you the raw document data instead, which is still valid and verified. Connection to the
        renderer or the template URL (
        <a href="#" style={{ color: "#2563EB", textDecoration: "underline" }}>
          {templateURL}
        </a>
        ) may be invalid.
      </>
    ),
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.5215 8.30118L18.6229 9.06111C18.8594 10.8425 18.5139 12.6526 17.6377 14.2215C16.7614 15.7905 15.4015 17.0341 13.7608 17.767C12.12 18.4999 10.2863 18.6828 8.53307 18.2884C6.77987 17.894 5.20113 16.9434 4.0323 15.5785C2.86348 14.2135 2.16719 12.5073 2.04729 10.7143C1.92739 8.92127 2.39031 7.13753 3.36699 5.6291C4.34367 4.12067 5.78179 2.96837 7.46687 2.34404C9.15195 1.71972 10.9937 1.65683 12.7174 2.16475"
          stroke="#E62617"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 7L8 13" stroke="#E62617" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7.00001L14 13" stroke="#E62617" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bgColor: "#FFEEED",
  },
};
export const NotificationBanner: React.FunctionComponent<any> = ({ notificationType, templateURL }) => {
  const notification = notificationTypes[notificationType];
  return (
    <div
      style={{
        minWidth: "260px",
        padding: "8px",
        border: "1px solid #D1D5DB",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: notification.bgColor,
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          minWidth: "140px",
          height: "36px",
          padding: "8px",
          gap: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {notification.icon()}

          <span
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              lineHeight: "20px",
              verticalAlign: "middle",
            }}
          >
            {notification.title}
          </span>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            color: "#2D5FAA",
            textDecoration: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Show less
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.1404 11.0002C10.1013 11.0391 10.0381 11.0392 9.99905 11.0002L6.47856 7.48674C6.18537 7.19414 5.7105 7.19462 5.4179 7.48781C5.1253 7.78099 5.12578 8.25587 5.41896 8.54847L9.54017 12.6614C9.83336 12.954 10.3082 12.9536 10.6008 12.6604C10.6018 12.6594 10.6028 12.6584 10.6037 12.6574L14.7175 8.5482C15.0106 8.25547 15.0109 7.7806 14.7181 7.48754C14.4254 7.19449 13.9505 7.19422 13.6575 7.48695L10.1404 11.0002Z"
              fill="#2D5FAA"
            />
          </svg>
        </button>
      </div>
      <p
        style={{
          padding: "8px",
          gap: "8px",
          fontSize: "14px",
          color: "#4B5563",
          marginLeft: "28px",
        }}
      >
        {notification.description(templateURL)}
      </p>
    </div>
  );
};

export default NotificationBanner;
