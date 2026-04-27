import { Tabs } from 'expo-router';
import { Platform, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Ícones SVG inline para não precisar de dependência extra
function HomeIcon({ focused }: { focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
      <View style={{
        width: 20, height: 20,
        borderRadius: 5,
        borderWidth: focused ? 0 : 2,
        borderColor: '#8C8A82',
        backgroundColor: focused ? '#2A9D76' : 'transparent',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {focused && <View style={{ width: 8, height: 8, backgroundColor: 'white', borderRadius: 2 }} />}
      </View>
    </View>
  );
}

function CalendarIcon({ focused }: { focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
      <View style={{
        width: 20, height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: focused ? '#2A9D76' : '#8C8A82',
        backgroundColor: 'transparent',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <View style={{
          width: '100%', height: 5,
          backgroundColor: focused ? '#2A9D76' : '#8C8A82',
          position: 'absolute', top: 0,
        }} />
      </View>
    </View>
  );
}

function BudgetIcon({ focused }: { focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
      <View style={{
        width: 16, height: 20,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: focused ? '#2A9D76' : '#8C8A82',
        backgroundColor: 'transparent',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
        paddingHorizontal: 2,
        paddingTop: 4,
      }}>
        {[0, 1, 2].map(i => (
          <View key={i} style={{
            width: '100%', height: 2,
            backgroundColor: focused ? '#2A9D76' : '#8C8A82',
            borderRadius: 1,
          }} />
        ))}
      </View>
    </View>
  );
}

function FinancialIcon({ focused }: { focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 18 }}>
        {[10, 16, 12, 18].map((h, i) => (
          <View key={i} style={{
            width: 4, height: h,
            backgroundColor: focused ? '#2A9D76' : '#8C8A82',
            borderRadius: 2,
          }} />
        ))}
      </View>
    </View>
  );
}

function ProfileIcon({ focused }: { focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
      <View style={{
        width: 16, height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: focused ? '#2A9D76' : '#8C8A82',
        backgroundColor: 'transparent',
        marginBottom: 1,
      }} />
      <View style={{
        width: 20, height: 6,
        borderTopLeftRadius: 10, borderTopRightRadius: 10,
        borderWidth: 2,
        borderColor: focused ? '#2A9D76' : '#8C8A82',
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
      }} />
    </View>
  );
}

// Botão central FAB (+)
function PlusIcon() {
  return (
    <View style={{
      width: 52, height: 52,
      borderRadius: 26,
      backgroundColor: '#2A9D76',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: Platform.OS === 'ios' ? 12 : 8,
      shadowColor: '#2A9D76',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    }}>
      <Text style={{ color: 'white', fontSize: 28, lineHeight: 30, fontWeight: '300' }}>+</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E3DC',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: '#2A9D76',
        tabBarInactiveTintColor: '#8C8A82',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ focused }) => <CalendarIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="new-order"
        options={{
          title: '',
          tabBarIcon: () => <PlusIcon />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Orçamentos',
          tabBarIcon: ({ focused }) => <BudgetIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="financial"
        options={{
          title: 'Financeiro',
          tabBarIcon: ({ focused }) => <FinancialIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}
