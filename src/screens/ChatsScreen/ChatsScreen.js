import { FlatList } from "react-native";
import chats from "../../../assets/data/chats.json";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./quieries";
import { useEffect, useState } from "react";

const ChatsScreen = () => {
  const [chatRooms, setchatRooms] = useState([]);
  useEffect(() => {
    const fetchChatRooms = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser?.attributes?.sub })
      );
      setchatRooms(response?.data?.getUser.ChatRooms.items);
    };
    fetchChatRooms();
  }, []);
  return (
    <FlatList
      // data={chats}
      data={chatRooms}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default ChatsScreen;
