import { Grid, Typography } from "@mui/material";
import { db, Prompt, PromptVersion } from "../../db";
import React from "react";
import { useParams } from "react-router";
import { PromptVersionForm } from "../components/PromptVersionForm/PromptVersionForm";
import { PromptVersionList } from "../components/PromptVersionList/PromptVersionList";
import { ContextVariables } from "../components/ContextVariables/ContextVariables";
import { toast } from "sonner";

interface ContextVariable {
  key: string;
  value: string;
}

const PromptStudioPage: React.FC = () => {
  const { id } = useParams();
  const [prompt, setPrompt] = React.useState<Prompt | null>(null);
  const [promptVersions, setPromptVersions] = React.useState<PromptVersion[]>(
    []
  );
  const [selectedVersion, setSelectedVersion] =
    React.useState<PromptVersion | null>(null);
  const [contextVariables, setContextVariables] = React.useState<
    ContextVariable[]
  >([{ key: "projectName", value: "" }]);

  const [promptContent, setPromptContent] = React.useState("");

  React.useEffect(() => {
    const fetchPrompt = async () => {
      if (id) {
        const fetchedPrompt = await db.prompts.get(id as never);
        setPrompt(fetchedPrompt);

        // Fetch prompt versions
        const fetchedVersions = await db.promptVersions
          .where("promptId")
          .equals(id)
          .reverse()
          .sortBy("version");
        setPromptVersions(fetchedVersions);
        setSelectedVersion(fetchedVersions[0] || null);
        setPromptContent(fetchedVersions[0]?.content || "");
      }
    };
    fetchPrompt();
  }, [id]);

  const handleVersionSelect = (version: PromptVersion) => {
    setSelectedVersion(version);
  };

  const handleSaveVersion = async (newVersion: PromptVersion) => {
    try {
      await db.promptVersions.add(newVersion);
      setPromptVersions([newVersion, ...promptVersions]);
      setSelectedVersion(newVersion);
      toast.success("Version saved successfully");
    } catch (error) {
      toast.error("Error saving version");
      throw error;
    }
  };

  const handleContextVariablesChange = (newVariables: ContextVariable[]) => {
    setContextVariables(newVariables);
  };

  const handleContentChange = (newContent: string) => {
    setPromptContent(newContent);
  };

  if (!prompt) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <h1>Prompt Studio</h1>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <h2>
            {prompt.name} - v{selectedVersion?.version || 0}
          </h2>
          <p>{prompt.objective}</p>

          <PromptVersionForm
            promptId={prompt.id}
            currentVersion={selectedVersion?.version || 0}
            selectedVersion={selectedVersion}
            onContentChange={handleContentChange}
            onSave={handleSaveVersion}
          />
        </Grid>
        <Grid item xs={4}>
          <h2>Actions</h2>
          <PromptVersionList
            versions={promptVersions}
            onVersionSelect={handleVersionSelect}
          />
          <ContextVariables
            content={promptContent}
            variables={contextVariables}
            onChange={handleContextVariablesChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PromptStudioPage;
