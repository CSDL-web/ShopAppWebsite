import { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: 36,
        borderRadius: "20px",
        border: "1px solid #ccc",
        boxShadow: "none",
        px: 1,
        flexShrink: 0,
      }}
    >
      <SearchIcon sx={{ fontSize: 18, color: "#999" }} />

      <InputBase
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        sx={{
          ml: 1,
          flex: 1,
          fontSize: "0.875rem",
        }}
      />
    </Paper>
  );
}
