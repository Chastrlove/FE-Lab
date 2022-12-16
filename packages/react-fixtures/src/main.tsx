import { createRoot } from "react-dom/client";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import "./index.css"



createRoot(document.getElementById("root")).render(<App />);
