// src/pages/UpdateProfile.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Camera, Lock, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileAPI, authAPI } from "../services/api";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const showMessage = (success, error = "") => {
    setSuccessMessage(success);
    setErrorMessage(error);
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleInfoUpdate = async (e) => {
    e.preventDefault();
    const { fullName, email } = profileData;

    if (!fullName?.trim() || !email?.trim()) {
      showMessage("", "Full name and email are required");
      return;
    }

    if (fullName.trim().length < 4) {
      showMessage("", "Name is too short. Minimum 4 characters required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showMessage("", "Invalid email format");
      return;
    }

    try {
      setIsUpdatingInfo(true);
      const response = await profileAPI.updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
      });

      updateUser(response.data.data);
      showMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        showMessage("", "Session expired. Please login again");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showMessage("", err.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
      showMessage("", "All password fields are required");
      return;
    }

    if (newPassword.trim().length < 6) {
      showMessage("", "New password must be at least 6 characters");
      return;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)) {
      showMessage("", "Password must include uppercase, lowercase, and number");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("", "New passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      showMessage("", "New password must be different from old password");
      return;
    }

    try {
      setIsChangingPassword(true);
      await authAPI.changePassword({ oldPassword, newPassword });

      showMessage("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      showMessage("", err.response?.data?.message || "Password update failed");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpdate = async () => {
    if (!avatar) {
      showMessage("", "Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      setIsUpdatingAvatar(true);
      const response = await profileAPI.updateAvatar(formData);
      updateUser({ avatar: response.data.data.avatar });
      showMessage("Avatar updated successfully!");
      setAvatar(null);
    } catch (err) {
      console.error(err);
      showMessage("", err.response?.data?.message || "Avatar update failed");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-white`}>
      {/* Navbar */}
      <Navbar showSearch={false} />

      {/* Main Content */}
      <div className="pt-20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center md:mt-14 mb-6 md:mb-0">
          <button
            onClick={() => navigate("/profile")}
            className={`flex items-center gap-2 ${theme.textMuted} hover:text-orange-400 transition-colors`}
          >
            <ArrowLeft size={20} />
            <span>Back to Profile</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className={`${theme.textMuted} hover:text-orange-400 transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold ${theme.gradientText} mb-2 text-center`}>
          Update Profile
        </h1>
        <p className={`text-center ${theme.textMuted} mb-8`}>
          Manage your account settings
        </p>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.success} p-3 rounded-xl mb-6 text-center`}
          >
            {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.error} p-3 rounded-xl mb-6 text-center`}
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-xl ${theme.card} border rounded-3xl p-6 md:p-8 mb-6 shadow-2xl`}
        >
          <h2 className={`text-xl font-semibold ${theme.text} mb-6 flex items-center gap-2`}>
            <Camera size={20} className="text-orange-400" />
            Update Avatar
          </h2>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/50 shadow-xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform`}
              >
                <Camera size={18} className="text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
            </div>

            {avatar && (
              <div className="flex gap-3 w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAvatarUpdate}
                  disabled={isUpdatingAvatar}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium disabled:opacity-50 shadow-lg`}
                >
                  <Save size={18} />
                  {isUpdatingAvatar ? "Uploading..." : "Upload Avatar"}
                </motion.button>
                <button
                  onClick={() => { setAvatar(null); setAvatarPreview(user?.avatar); }}
                  className={`px-6 py-3 rounded-xl ${theme.buttonSecondary} ${theme.text} transition-colors`}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`backdrop-blur-xl ${theme.card} border rounded-3xl p-6 md:p-8 mb-6 shadow-2xl`}
        >
          <h2 className={`text-xl font-semibold ${theme.text} mb-6 flex items-center gap-2`}>
            <User size={20} className="text-pink-400" />
            Profile Information
          </h2>

          <form onSubmit={handleInfoUpdate} className="space-y-4">
            <div>
              <label className={`text-sm ${theme.textMuted} mb-1 block`}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                placeholder="Your full name"
                className={`w-full p-3 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all`}
              />
            </div>

            <div>
              <label className={`text-sm ${theme.textMuted} mb-1 block`}>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="your@email.com"
                className={`w-full p-3 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isUpdatingInfo}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium disabled:opacity-50 shadow-lg`}
            >
              <Save size={18} />
              {isUpdatingInfo ? "Updating..." : "Update Profile"}
            </motion.button>
          </form>
        </motion.div>

        {/* Password Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`backdrop-blur-xl ${theme.card} border rounded-3xl p-6 md:p-8 shadow-2xl`}
        >
          <h2 className={`text-xl font-semibold ${theme.text} mb-6 flex items-center gap-2`}>
            <Lock size={20} className="text-rose-400" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className={`text-sm ${theme.textMuted} mb-1 block`}>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className={`w-full p-3 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all`}
              />
            </div>

            <div>
              <label className={`text-sm ${theme.textMuted} mb-1 block`}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className={`w-full p-3 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all`}
              />
            </div>

            <div>
              <label className={`text-sm ${theme.textMuted} mb-1 block`}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className={`w-full p-3 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isChangingPassword}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium disabled:opacity-50 shadow-lg`}
            >
              <Lock size={18} />
              {isChangingPassword ? "Changing..." : "Change Password"}
            </motion.button>
          </form>
        </motion.div>
      </div>
      </div>
    </div>
  );
}