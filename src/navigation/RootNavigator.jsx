import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator, Pressable } from "react-native";
import { Home as HomeIcon, LayoutGrid, Clock3, Newspaper, User, QrCode } from "lucide-react-native";

import HomeScreen from "../screens/HomeScreen";
import ShareScreen from "../screens/ShareScreen";
import CategoryScreen from "../screens/CategoryScreen";
import HistoryScreen from "../screens/HistoryScreen";
import NewsScreen from "../screens/NewsScreen";
import NewsDetailScreen from "../screens/NewsDetailScreen";
import AccountScreen from "../screens/AccountScreen";
import AuthScreen from "../screens/AuthScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import FaqScreen from "../screens/FaqScreen";
import ArticleScreen from "../screens/ArticleScreen";
import GuideScreen from "../screens/GuideScreen";

import { colors } from "../theme";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Web dùng URL (/lich-su-giao-dich). Mobile không có URL —
 * điều hướng chính chuyển thành Bottom Tabs, các trang phụ nằm trong Stack.
 */
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.gradientFrom },
        headerTintColor: colors.onDark,
        headerTitleStyle: { fontWeight: "800" },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Nạp thẻ",
          tabBarLabel: "Nạp thẻ",
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Share")}
              hitSlop={12}
              style={{ paddingHorizontal: 16 }}
              accessibilityLabel="Chia sẻ mã QR mở web"
            >
              <QrCode color={colors.onDark} size={22} />
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          title: "Danh mục",
          tabBarLabel: "Danh mục",
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Lịch sử giao dịch",
          tabBarLabel: "Lịch sử",
          tabBarIcon: ({ color, size }) => <Clock3 color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: "Tin tức",
          tabBarLabel: "Tin tức",
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "Tài khoản",
          tabBarLabel: "Tài khoản",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { loading } = useAuth();

  // AsyncStorage đọc bất đồng bộ → chờ xong mới render, tránh nháy màn hình đăng nhập
  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.gradientFrom },
        headerTintColor: colors.onDark,
        headerTitleStyle: { fontWeight: "700", fontSize: 16 },
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ title: "Đăng nhập", presentation: "modal" }}
      />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Đặt mua" }} />
      <Stack.Screen name="Share" component={ShareScreen} options={{ title: "Chia sẻ / QR" }} />
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ title: "Tin tức" }} />
      <Stack.Screen name="Faq" component={FaqScreen} options={{ title: "Hỏi đáp" }} />
      <Stack.Screen name="Article" component={ArticleScreen} options={{ title: "Chính sách" }} />
      <Stack.Screen name="Guide" component={GuideScreen} options={{ title: "Hướng dẫn" }} />
    </Stack.Navigator>
  );
}
