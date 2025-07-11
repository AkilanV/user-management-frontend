import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  IconButton,
  Pagination,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { axiosInstance } from "../../utils/axiosinstance";
import UserModal from "./userModal";
import { useSnackbar } from "notistack";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState<"table" | "grid">("table");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async (pageNum: number) => {
    try {
      const response = await axiosInstance.get(`/users?page=${pageNum}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(`/users/${userToDelete.id}`);
      enqueueSnackbar("User deleted successfully", { variant: "success" });
      setDeleteDialogOpen(false);
      fetchUsers(page);
    } catch (error) {
      enqueueSnackbar("Failed to delete user", { variant: "error" });
      console.error("Failed to delete user", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: "100vw" }}>
      <Container
        maxWidth="xl"
        sx={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: 3 }}
      >
        <Box py={4}>
          <Typography variant="h5" gutterBottom>
            Users
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                size="small"
                placeholder="input search text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Box>

            <Button
              onClick={() => {
                setModalMode("add");
                setModalOpen(true);
              }}
              variant="contained"
              color="primary"
            >
              Create User
            </Button>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => setView(newView)}
              size="small"
            >
              <ToggleButton value="table">
                <TableRowsIcon />
              </ToggleButton>
              <ToggleButton value="grid">
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {view === "table" ? (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        First Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Last Name
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar src={user.avatar} alt={user.first_name} />
                          </Stack>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.first_name}</TableCell>
                        <TableCell>{user.last_name}</TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setSelectedUser({
                                  id: user.id,
                                  name: user.first_name,
                                  job: user.last_name,
                                  email: user.email,
                                  profileimageLink: user.avatar,
                                });
                                setModalMode("edit");
                                setModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                setUserToDelete(user);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Box display="flex" flexWrap="wrap" gap={2}>
              {filteredUsers.map((user) => (
                <Paper
                  key={user.id}
                  sx={{
                    width: 280,
                    p: 2,
                    position: "relative",
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                    "&:hover .actions": { opacity: 1, pointerEvents: "auto" },
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <Avatar src={user.avatar} sx={{ width: 64, height: 64 }} />
                    <Typography fontWeight="bold">
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography color="primary">{user.email}</Typography>
                  </Stack>
                  <Box
                    className="actions"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      opacity: 0,
                      pointerEvents: "none",
                      transition: "opacity 0.3s ease-in-out",
                      backgroundColor: "rgba(255,255,255,0.4)",
                    }}
                  >
                    <IconButton
                      sx={{
                        bgcolor: "#1976d2",
                        color: "#fff",
                        "&:hover": { bgcolor: "#115293" },
                      }}
                      onClick={() => {
                        setSelectedUser({
                          id: user.id,
                          name: user.first_name,
                          job: user.last_name,
                          email: user.email,
                          profileimageLink: user.avatar,
                        });
                        setModalMode("edit");
                        setModalOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: "#d32f2f",
                        color: "#fff",
                        "&:hover": { bgcolor: "#9a0007" },
                      }}
                      onClick={() => {
                        setUserToDelete(user);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </Box>

        {/* Add/Edit Modal */}
        <UserModal
          open={modalOpen}
          mode={modalMode}
          userData={selectedUser}
          onClose={(refresh) => {
            setModalOpen(false);
            if (refresh) fetchUsers(page);
          }}
        />

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="contained"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UsersDashboard;
