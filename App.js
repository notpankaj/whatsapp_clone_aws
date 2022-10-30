import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navigator from "./src/navigation";
import awsconfig from "./src/aws-exports";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import { useEffect } from "react";
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";
Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
  useEffect(() => {
    const syncUser = async () => {
      //get Auth User
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      const SUB_ID = authUser?.attributes?.sub;
      //query the db using Auth Users id (sub)
      const userData = await API.graphql(
        graphqlOperation(getUser, { id: SUB_ID })
      );
      if (userData?.data?.getUser) {
        console.log("User Already Exsist in Database!");
        return;
      }
      //if there is  no user  in db, create one
      const newUser = {
        id: SUB_ID,
        name: authUser?.attributes?.phone_number,
        status: "Hey, I am using Whatsapp",
      };
      const newUserRes = await API.graphql(
        graphqlOperation(createUser, { input: newUser })
      );
    };
    syncUser();
  }, []);
  return (
    <View style={styles.container}>
      <Navigator />
      <StatusBar style="auto" />
    </View>
  );
}
export default withAuthenticator(App);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    justifyContent: "center",
  },
});
