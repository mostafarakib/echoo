import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { toaster } from "../ui/create-toaster";
import { Box, Button, Input } from "@chakra-ui/react";
import UserListItem from "../UserListItem";
import SelectedUser from "../SelectedUser";

function CreateGroupDialog({ onClose }) {
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");

  const { user, chats, setChats } = ChatState();

  const handleUserSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toaster.create({
        title: "Error Occured!",
        description: "Failed to load the searched users",
        type: "error",
        closable: true,
      });
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
        closable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToDelete._id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName || !selectedUsers) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
        closable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChats([data, ...chats]);
      toaster.create({
        title: "New Group Created!",
        type: "success",
        closable: true,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to create group",
        description: error.message,
        type: "error",
        closable: true,
      });
    }
    onClose();
  };
  return (
    <Box>
      <Box
        as={"form"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Group Name"
          marginBottom={"3"}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Input
          placeholder="Add users eg: Farhan, Rakib, John"
          marginBottom={"2"}
          // value={search}
          onChange={(e) => handleUserSearch(e.target.value)}
        />
        <Box display={"flex"}>
          {selectedUsers.map((user) => (
            <SelectedUser
              key={user._id}
              user={user}
              handleFunction={() => handleDelete(user)}
            />
          ))}
        </Box>
        {/* // render searched users here */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          searchResult
            ?.slice(0, 4)
            .map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
        )}

        <Button alignSelf={"flex-end"} onClick={handleSubmit}>
          Create Group
        </Button>
      </Box>
    </Box>
  );
}

export default CreateGroupDialog;
