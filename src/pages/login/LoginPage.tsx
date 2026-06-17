import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { LabeledInput } from "../../components/forms/LabeledInput";
import { PageContainer } from "../../components/layout/PageContainer";
import { GlassCard } from "../../components/ui/GlassCard";
import { authService } from "../../lib/firebaseAuth";

type AuthMode = "signIn" | "signUp";

interface LoginLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

function getAuthErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "An account already exists with that email address.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "The email or password does not look right.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was closed before it finished.";
      case "auth/weak-password":
        return "Use a password with at least 6 characters.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuthReady, user: currentUser } = useAuth();

  const displayName = useMemo(() => {
    if (!currentUser) {
      return "";
    }

    return currentUser.displayName || currentUser.email || "Planner member";
  }, [currentUser]);

  const redirectPath = useMemo(() => {
    const from = (location.state as LoginLocationState | null)?.from;

    if (!from?.pathname || from.pathname === "/login") {
      return "/dashboard";
    }

    return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
  }, [location.state]);

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (authMode === "signIn") {
        await authService.signInWithEmail(email, password);
      } else {
        await authService.createAccountWithEmail(email, password);
      }

      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setErrorMessage("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await authService.signInWithGoogle();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    setErrorMessage("");
    setMessage("");

    if (!email) {
      setErrorMessage("Enter your email address first.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.sendPasswordReset(email);
      setMessage("Password reset email sent.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setErrorMessage("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await authService.signOut();
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSignUp = authMode === "signUp";

  return (
    <PageContainer>
      <Stack spacing={3}>
        <GlassCard>
          <Stack spacing={3}>
            {!isAuthReady ? (
              <Stack sx={{ alignItems: "center", py: 4 }}>
                <CircularProgress sx={{ color: "var(--aura-primary)" }} />
              </Stack>
            ) : currentUser ? (
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={currentUser.photoURL ?? undefined}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "var(--aura-primary)",
                    }}
                  >
                    <PersonRoundedIcon />
                  </Avatar>
                  <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "var(--aura-primary)" }}
                    >
                      {displayName}
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--aura-on-surface-variant)",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {currentUser.email ?? "No email on file"}
                    </Typography>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "var(--aura-surface-container-low)",
                    p: 2,
                  }}
                >
                  <Stack spacing={1.25}>
                    <AccountDetail label="User ID" value={currentUser.uid} />
                    <AccountDetail
                      label="Email verified"
                      value={currentUser.emailVerified ? "Yes" : "No"}
                    />
                    <AccountDetail
                      label="Provider"
                      value={
                        currentUser.providerData[0]?.providerId ?? "Firebase"
                      }
                    />
                  </Stack>
                </Box>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleSignOut}
                  disabled={isSubmitting}
                >
                  Sign out
                </Button>
              </Stack>
            ) : (
              <Stack component="form" spacing={2.5} onSubmit={handleEmailAuth}>
                <LabeledInput
                  label="EMAIL ADDRESS"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={isSubmitting}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineRoundedIcon
                            sx={{ color: "var(--aura-outline)" }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />

                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--aura-on-surface-variant)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      PASSWORD
                    </Typography>
                    <Button
                      type="button"
                      size="small"
                      onClick={handlePasswordReset}
                      disabled={isSubmitting}
                      sx={{
                        minWidth: 0,
                        color: "var(--aura-secondary)",
                        fontWeight: 700,
                      }}
                    >
                      Forgot?
                    </Button>
                  </Stack>

                  <LabeledInput
                    label=""
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon
                              sx={{ color: "var(--aura-outline)" }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              edge="end"
                              onClick={() => setShowPassword((value) => !value)}
                            >
                              {showPassword ? (
                                <VisibilityOffRoundedIcon />
                              ) : (
                                <VisibilityRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Stack>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {message && <Alert severity="success">{message}</Alert>}

                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ minHeight: 48 }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                  ) : isSignUp ? (
                    "Create account with email"
                  ) : (
                    "Sign in with email"
                  )}
                </Button>

                <Divider sx={{ color: "var(--aura-on-surface-variant)" }}>
                  OR
                </Divider>

                <Button
                  type="button"
                  fullWidth
                  size="large"
                  variant="outlined"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  startIcon={<GoogleIcon />}
                  sx={{
                    minHeight: 48,
                    borderColor: "var(--aura-outline-variant)",
                    color: "var(--aura-primary)",
                    bgcolor: "var(--aura-surface-container-lowest)",
                  }}
                >
                  Continue with Google
                </Button>

                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography sx={{ color: "var(--aura-on-surface-variant)" }}>
                    {isSignUp ? "Already have an account?" : "New to AI Financial Planner?"}
                  </Typography>
                  <Button
                    type="button"
                    size="small"
                    onClick={() => {
                      setAuthMode(isSignUp ? "signIn" : "signUp");
                      setErrorMessage("");
                      setMessage("");
                    }}
                    sx={{
                      color: "var(--aura-secondary)",
                      fontWeight: 700,
                    }}
                  >
                    {isSignUp ? "Sign in" : "Create account"}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </GlassCard>
      </Stack>
    </PageContainer>
  );
}

interface AccountDetailProps {
  label: string;
  value: string;
}

function AccountDetail({ label, value }: AccountDetailProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={0.5}
      sx={{
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography sx={{ color: "var(--aura-on-surface-variant)" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          color: "var(--aura-primary)",
          fontFamily: "var(--aura-data-mono)",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
