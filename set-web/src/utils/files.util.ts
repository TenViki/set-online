import { serverUrl } from "../api/server";

export const getAvatar = (id: string) => `${serverUrl}user/avatars/${id}`;
