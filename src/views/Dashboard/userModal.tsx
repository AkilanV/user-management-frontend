import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { axiosInstance } from '../../utils/axiosinstance';

interface UserModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  userData?: {
    id: number;
    name: string;
    job: string;
    email?: string;
    profileimageLink?: string;
  };
  onClose: (refresh?: boolean) => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, mode, userData, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (mode === 'edit' && userData) {
      setFirstName(userData.name || '');
      setLastName(userData.job || '');
      setEmail(userData.email || '');
      setProfileImage(userData.profileimageLink || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setProfileImage('');
    }
  }, [mode, userData]);

  const handleSubmit = async () => {
    try {
      const payload = {
        name: firstName,
        job: lastName,
        email,
        profileimageLink: profileImage,
      };

      if (mode === 'add') {
        await axiosInstance.post('/users', payload);
        enqueueSnackbar('User added successfully', { variant: 'success' });
      } else if (mode === 'edit' && userData?.id) {
        await axiosInstance.put(`/users/${userData.id}`, payload);
        enqueueSnackbar('User updated successfully', { variant: 'success' });
      }

      onClose(true);
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };


  return (
    <Dialog open={open} onClose={() => onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'add' ? 'Add User' : 'Edit User'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="First Name"
            value={firstName}
            fullWidth
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            value={lastName}
            fullWidth
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Profile Image URL"
            value={profileImage}
            fullWidth
            onChange={(e) => setProfileImage(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="contained" color="error">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {mode === 'add' ? 'Add' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
