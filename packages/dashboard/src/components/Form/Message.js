const types = {
  error: {
    backgroundColor: "bg-red-50",
    titleColor: "text-red-800",
    detailsColor: "text-red-700",
    iconColor: "text-red-400",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    ),
  },
  info: {
    backgroundColor: "bg-blue-50",
    titleColor: "text-blue-800",
    detailsColor: "text-blue-700",
    iconColor: "text-blue-400",
    icon: (
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    ),
  },
};

export default function Message({ type = "info", title, items = [] }) {
  const { backgroundColor, titleColor, detailsColor, iconColor, icon } = types[type];

  return (
    <div className={`rounded-md ${backgroundColor} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${iconColor}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            {icon}
          </svg>
        </div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${titleColor}`}>{title}</h3>}
          {items.length > 0 && (
            <div className={`${title ? "mt-2" : ""} text-sm ${detailsColor}`}>
              <ul className={`${items.length > 1 ? "list-disc pl-5 space-y-1" : ""}`}>
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
