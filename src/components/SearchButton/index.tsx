import React from "react";
import { Button } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export interface SearchButtonProps {
  text: string | React.ReactNode;
  onClick: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  text,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      size="medium"
      fullWidth
      sx={{ height: "100%", margin: "auto" }}
      onClick={() => onClick()}
      startIcon={<SearchIcon />}
    >
      {text}
    </Button>
  );
};
