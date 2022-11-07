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
      const rooms = response?.data?.getUser.ChatRooms.items || [];
      const sortedRooms = rooms.sort((r1, r2) => {
        return (
          new Date(r1.chatRoom.updatedAt) - new Date(r2.chatRoom.updatedAt)
        );
      });
      setchatRooms(sortedRooms);
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
