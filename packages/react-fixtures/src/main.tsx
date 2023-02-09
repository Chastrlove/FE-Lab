import { createRoot } from "react-dom/client";
import ReactDom from "react-dom";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import "./index.css"



ReactDom.render(<App />,document.getElementById("root"));
