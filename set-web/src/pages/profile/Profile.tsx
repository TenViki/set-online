import React from "react";
import Page from "../../components/page/Page";
import { useUser } from "../../utils/useUser";
import ProfileSideMenu from "./components/ProfileSideMenu";

const Profile = () => {
  const user = useUser();

  if (!user.isLoggedIn) {
    if (user.isLoading) return <div>Loading...</div>;
    return <>Not logged in !</>;
  }

  return (
    <Page>
      <ProfileSideMenu />
    </Page>
  );
};

export default Profile;
