import React from "react";
import { ReusableTable } from "./Table";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "category", label: "Category", minWidth: 100 },
  {
    id: "score",
    label: "Score",
    minWidth: 170,
    align: "right" as const,
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "date",
    label: "Date Created",
    minWidth: 170,
    align: "right" as const,
    format: (value: string) => new Date(value).toLocaleDateString(),
  },
];

const sampleData = [
  {
    name: "Code Review Prompt",
    category: "Development",
    score: 4.5,
    date: "2024-03-15",
  },
  {
    name: "Bug Analysis",
    category: "Debugging",
    score: 4.8,
    date: "2024-03-14",
  },
  // Add more sample data as needed
];

export const TableExample: React.FC = () => {
  return <ReusableTable columns={columns} rows={sampleData} />;
};
