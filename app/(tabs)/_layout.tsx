import { Tabs } from "expo-router";
import '../globals.css'
import {Text} from "react-native";

const _Layout = () => {
    return (
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
              tabBarLabel: ({ focused, color })=>(
                  <>
                      <Text className={"text-2xl"}>text</Text>
                  </>
              )
          }}
          ></Tabs.Screen>
        <Tabs.Screen
            name="chrono"
            options={{
              title: "Chrono",
              headerShown: false,
            }}

        ></Tabs.Screen>
        <Tabs.Screen
            name="add"
            options={{
              title: "Add",
              headerShown: false
            }}
        ></Tabs.Screen>
      </Tabs>
  )
}

export default _Layout