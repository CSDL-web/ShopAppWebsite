import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";

import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

export default function UserSettingsPage() {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const [avatarUrl, setAvatarUrl] = React.useState<string>(
    // demo avatar
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
  );

  const [firstName, setFirstName] = React.useState("Bryan");
  const [lastName, setLastName] = React.useState("Cranston");

  const [emails, setEmails] = React.useState<string[]>(["bryan.cranston@mail.com"]);

  const [currentPw, setCurrentPw] = React.useState("password");
  const [newPw, setNewPw] = React.useState("password");
  const [showCur, setShowCur] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

  const onPickAvatar = () => fileRef.current?.click();

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
    // NOTE: Nếu upload thật -> gọi API ở đây
  };

  const onDeleteAvatar = () => {
    setAvatarUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const addEmail = () => setEmails((prev) => [...prev, ""]);

  const updateEmail = (idx: number, value: string) => {
    setEmails((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const removeEmail = (idx: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== idx));
  };

  const sectionTitleSx = { fontWeight: 800, fontSize: 14 } as const;
  const sectionHintSx = { color: "text.secondary", fontSize: 13 } as const;

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
    },
  } as const;

  return (
    <Box sx={{ minHeight: "100vh", background: "#fff", py: { xs: 3, sm: 5 } }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >

<Box sx={{ mb: 1.5 }}>
  <Button
    component={RouterLink}
    to="/"
    startIcon={<HomeRoundedIcon />}
    sx={{
      textTransform: "none",
      fontWeight: 800,
      borderRadius: "999px",
      px: 2,
      backgroundColor: "rgba(0,0,0,0.04)",
      color: "text.primary",
      "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
    }}
  >
    Home
  </Button>
</Box>


          <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
            Account
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            Real-time information and activities of your property.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Profile picture */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar
              src={avatarUrl || undefined}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "rgba(0,0,0,0.08)",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={sectionTitleSx}>Profile picture</Typography>
              <Typography sx={sectionHintSx}>PNG, JPEG under 15MB</Typography>
            </Box>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={onAvatarChange}
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={onPickAvatar}
                startIcon={<UploadRoundedIcon />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Upload new picture
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                onClick={onDeleteAvatar}
                startIcon={<DeleteOutlineRoundedIcon />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "rgba(0,0,0,0.02)",
                }}
              >
                Delete
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Full name */}
          <Box>
            <Typography sx={sectionTitleSx}>Full name</Typography>

            <Box
              sx={{
                mt: 1.5,
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <Box>
                <Typography sx={sectionHintSx}>First name</Typography>
                <TextField
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <Typography sx={sectionHintSx}>Last name</Typography>
                <TextField
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={fieldSx}
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Contact email */}
          <Box>
            <Typography sx={sectionTitleSx}>Contact email</Typography>
            <Typography sx={sectionHintSx}>
              Manage your accounts email address for the invoices.
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
              {emails.map((val, idx) => (
                <Stack
                  key={idx}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ sm: "center" }}
                >
                  <TextField
                    fullWidth
                    value={val}
                    onChange={(e) => updateEmail(idx, e.target.value)}
                    placeholder="email@address.com"
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineRoundedIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment:
                        emails.length > 1 ? (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="remove email"
                              onClick={() => removeEmail(idx)}
                              edge="end"
                            >
                              <DeleteOutlineRoundedIcon />
                            </IconButton>
                          </InputAdornment>
                        ) : undefined,
                    }}
                  />
                </Stack>
              ))}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={addEmail}
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 800,
                    px: 2,
                  }}
                >
                  Add another email
                </Button>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Password */}
          <Box>
            <Typography sx={sectionTitleSx}>Password</Typography>
            <Typography sx={sectionHintSx}>Modify your current password.</Typography>

            <Box
              sx={{
                mt: 1.5,
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <Box>
                <Typography sx={sectionHintSx}>Current password</Typography>
                <TextField
                  fullWidth
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  type={showCur ? "text" : "password"}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCur((v) => !v)} edge="end">
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography sx={sectionHintSx}>New password</Typography>
                <TextField
                  fullWidth
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  type={showNew ? "text" : "password"}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNew((v) => !v)} edge="end">
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                }}
                onClick={() => {
                  // TODO: gọi API save settings
                  console.log({ firstName, lastName, emails, currentPw, newPw, avatarUrl });
                  alert("Saved (demo)");
                }}
              >
                Save changes
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
