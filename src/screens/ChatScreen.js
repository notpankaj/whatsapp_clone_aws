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
import { getChatRoom } from "../graphql/queries";

import bg from "../../assets/images/BG.png";
import messages from "../../assets/data/messages.json";

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [chatroom, setChatroom] = useState(null);

  const chatroomID = route.params.id;
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (res) => {
        setChatroom(res?.data?.getChatRoom);
      }
    );
  }, []);

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
