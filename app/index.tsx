import { Text } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeFooter } from '@/app/components/home/HomeFooter';

export default function Index() {
    return (
        <SafeAreaView className={"flex-1 justify-center items-center"}>
            <Text className={"text-3xl font-bold color-primary"}>WELCOME</Text>
            <Link href="/exercise/curl">Curl</Link>
            <HomeFooter />
        </SafeAreaView>
    );
}
