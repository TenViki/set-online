import React from "react";
import Page from "../../components/page/Page";
import { useUser } from "../../utils/useUser";

const Profile = () => {
  const user = useUser();

  if (!user.isLoggedIn) {
    if (user.isLoading) return <div>Loading...</div>;
    return <>Not logged in !</>;
  }

  return (
    <Page>
      <h1>Profile</h1>
      Logged in as:
    </Page>
  );
};

export default Profile;
