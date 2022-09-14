import React, { FC, useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { invitePlayerRequest } from "../../../api/game";
import { findUsers } from "../../../api/users";
import Button from "../../../components/button/Button";
import ClickableUser from "../../../components/clickableUser/ClickableUser";
import TextField from "../../../components/fields/TextField";
import { ApiError } from "../../../types/Api.type";
import { UserLowType } from "../../../types/Game.type";
import "./InvitePlayers.scss";

interface InvitePlayersProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitePlayers: FC<InvitePlayersProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const usersSearchMutation = useMutation(findUsers);

  const handleChange = (e: string) => {
    setSearch(e);

    if (e.length) {
      usersSearchMutation.mutate(e);
    }
  };

  useEffect(() => {
    // on esc close
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const inviteUserMutation = useMutation(invitePlayerRequest, {
    onSuccess: () => {
      onClose();
    },

    onError: (err: ApiError) => {
      toast.error(err.response?.data.error.message || "An error occured");
    },
  });

  return (
    <div className={`invite-players ${isOpen ? "opened" : ""}`}>
      <div className="invite-players-header">
        <TextField
          placeholder="Type to search..."
          color="main"
          icon={FiSearch}
          onChange={handleChange}
          value={search}
          disableAutofill={true}
        />
        <Button rightIcon={FiX} onClick={onClose} color="danger" variant="text" />
      </div>

      <div className="invite-players-search">
        {!usersSearchMutation.data?.length ? (
          <p className="error">No users found</p>
        ) : (
          usersSearchMutation.data.map((user) => (
            <ClickableUser user={user} onClick={(usr) => inviteUserMutation.mutate(usr.id)} />
          ))
        )}
      </div>
    </div>
  );
};

export default InvitePlayers;
