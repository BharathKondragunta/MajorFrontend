import { Tabs } from 'expo-router';
import { LayoutDashboard, Briefcase, FileSearch, Settings, PlusCircle } from 'lucide-react-native';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                    backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: colorScheme === 'dark' ? '#1f2937' : '#f1f5f9',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: colorScheme === 'dark' ? '#ffffff' : '#0ea5e9',
                tabBarInactiveTintColor: colorScheme === 'dark' ? '#4b5563' : '#94a3b8',
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                    fontSize: 12,
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="cases"
                options={{
                    title: 'Cases',
                    tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="evidence_tab"
                options={{
                    title: 'Evidence', // Placeholder for direct evidence access or scanning
                    tabBarIcon: ({ color, size }) => <FileSearch size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
