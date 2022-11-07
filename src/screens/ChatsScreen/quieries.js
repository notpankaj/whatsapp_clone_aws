export const listChatRooms = `
query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            updatedAt
            users {
              items {
                user {
                  id
                  name
                  image
                }
              }
            }
            LastMessage {
              createdAt
              id
              text
            }
          }
        }
      }
    }
  }
  `;
