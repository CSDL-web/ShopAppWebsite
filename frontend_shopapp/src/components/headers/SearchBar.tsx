import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS } from "@/styles/colors";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", alignItems: "center", width: "80vw" }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Amazon"
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton
        type="submit"
        sx={{
          backgroundColor: COLORS.paleOrange,
          borderRadius: "0 4px 4px 0",
          "&:hover": { backgroundColor: COLORS.orange },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
