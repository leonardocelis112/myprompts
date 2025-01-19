import * as React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <>
      <Typography>Welcome to Toolpad Core!</Typography>
      <Link to="/orders">Orders</Link>
    </>
  );
}
