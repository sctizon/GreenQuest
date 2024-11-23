import { SessionProvider } from "@/contexts/ctx";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <SessionProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Hides the header for all screens in the Stack
        }}
      />
    </SessionProvider>
  );
}
