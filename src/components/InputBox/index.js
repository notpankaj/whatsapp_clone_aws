import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";

const InputBox = ({ chatroom }) => {
  const [newMessage, setNewMessage] = useState("");

  const onSend = async () => {

    const authUser = await Auth.currentAuthenticatedUser();
    const messageData = {
      chatroomID: chatroom?.id,
      text: newMessage,
      userID: authUser?.attributes.sub,
    };
    const newMessageRes = await API.graphql(
      graphqlOperation(createMessage, { input: messageData })
    );
    setNewMessage("");

    // update last message
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatroom._version,
          chatRoomLastMessageId: newMessageRes?.data?.createMessage?.id,
          id: chatroom?.id,
        },
      })
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      {/* Icon */}
      <AntDesign name="plus" size={20} color="royalblue" />

      {/* Text Input */}
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder="type your message..."
      />

      {/* Icon */}
      <MaterialIcons
        onPress={onSend}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
});

export default InputBox;
