import * as React from "react";
import { HashRouter, Route, Routes } from "react-router";
import * as ReactDOM from "react-dom/client";
import Layout from "./layouts/dashboard";
import BackupsPage from "./pages/BackupsPage";
import LabelsPage from "./pages/LabelsPage";
import PromptsPage from "./pages/PromptsPage";
import ProjectsPage from "./pages/ProjectsPage";

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PromptsPage />} />
          <Route path="prompts" element={<PromptsPage />} />
          <Route path="labels" element={<LabelsPage />} />
          <Route path="backups" element={<BackupsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
