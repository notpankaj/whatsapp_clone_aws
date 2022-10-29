import { View, Button } from "react-native";
import React from "react";
import { Auth } from "aws-amplify";

const SettingScreen = () => {
  const onLogout = () => {
    Auth.signOut();
  };
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

export default SettingScreen;
