import * as React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";

export default function OrdersPage() {
  return (
    <>
      <Typography>Welcome to the Toolpad orders!</Typography>
      <Link to="/">Home</Link>
    </>
  );
}
