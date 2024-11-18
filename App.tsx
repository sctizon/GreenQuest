import { Stack } from 'expo-router'; // Import the Tabs
import { AuthProvider } from '@/contexts/AuthContext';

// function Root() {
//   const { loading } = useAuth();

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return <Stack />;
// }

export default function AppIndex() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
