import React, { FC, useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useMutation } from "react-query";
import { findUsers } from "../../../api/users";
import Button from "../../../components/button/Button";
import ClickableUser from "../../../components/clickableUser/ClickableUser";
import TextField from "../../../components/fields/TextField";
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
          usersSearchMutation.data.map((user) => <ClickableUser user={user} />)
        )}
      </div>
    </div>
  );
};

export default InvitePlayers;
