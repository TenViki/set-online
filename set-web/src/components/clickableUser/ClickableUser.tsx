import React, { FC } from "react";
import { FiUser } from "react-icons/fi";
import { UserLowType } from "../../types/Game.type";
import { getAvatar } from "../../utils/files.util";
import "./ClickableUser.scss";

interface ClickableUserprops {
  user: UserLowType;
  onClick?: (user: UserLowType) => void;
}

const ClickableUser: FC<ClickableUserprops> = ({ onClick, user }) => {
  return (
    <button className="user-clickable" onClick={() => onClick && onClick(user)}>
      <div className="user-clickable-avatar">{user.avatar ? <img src={getAvatar(user.avatar)} alt="avatar" /> : <FiUser />}</div>
      <div className="user-clickable-name">{user.username}</div>
    </button>
  );
};

export default ClickableUser;
