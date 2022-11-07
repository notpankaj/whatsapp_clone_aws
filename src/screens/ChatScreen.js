import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Message from "../components/Message";
import InputBox from "../components/InputBox";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries";
import { onCreateMessage } from "../graphql/subscriptions";

import bg from "../../assets/images/BG.png";
import messages from "../../assets/data/messages.json";

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [chatroom, setChatroom] = useState(null);
  const [messages, setMessages] = useState(null);

  const chatroomID = route.params.id;

  //fetch chatRoom
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (res) => {
        setChatroom(res?.data?.getChatRoom);
      }
    );
  }, []);
  //fetch messages
  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID,
        sortDirection: "DESC",
      })
    ).then((res) => {
      setMessages(res?.data?.listMessagesByChatRoom?.items);
    });

    // Subscribe to new messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: ({ value }) => {
        setMessages((m) => [value.data.onCreateMessage, ...m]);
      },
      error: () => console.warn(error),
    });
    return () => subscription.unsubscribe();
  }, [chatroomID]);

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params.name]);
  if (!chatroom) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={chatroom?.Messages?.items}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.list}
          inverted
        />
        <InputBox chatroom={chatroom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;
