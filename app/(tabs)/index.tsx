import { Button, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView className={"flex-1 justify-center items-center"}>
      <Text className={"text-3xl font-bold color-primary"}>WELCOME</Text>
      <Link href="/exercice/curl">Curl</Link>
    </SafeAreaView>
  );
}
