import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Refrigerator, Sparkles, BookOpen, Heart, Ellipsis, LucideIcon } from 'lucide-react-native';
import { AppText } from '../components';
import { colors, fontFamily } from '../theme';
import { FridgeNavigator } from './FridgeNavigator';
import { GeneratorNavigator } from './GeneratorNavigator';
import { RecipesNavigator } from './RecipesNavigator';
import { FavoritesNavigator } from './FavoritesNavigator';
import { MoreNavigator } from './MoreNavigator';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabs: { name: keyof MainTabParamList; label: string; icon: LucideIcon; component: React.ComponentType }[] = [
  { name: 'FridgeTab', label: 'Lodówka', icon: Refrigerator, component: FridgeNavigator },
  { name: 'GeneratorTab', label: 'Generator', icon: Sparkles, component: GeneratorNavigator },
  { name: 'RecipesTab', label: 'Przepisy', icon: BookOpen, component: RecipesNavigator },
  { name: 'FavoritesTab', label: 'Ulubione', icon: Heart, component: FavoritesNavigator },
  { name: 'MoreTab', label: 'Więcej', icon: Ellipsis, component: MoreNavigator },
];

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.mute,
        tabBarStyle: {
          height: 80,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.line,
          paddingTop: 11,
        },
        tabBarItemStyle: {
          gap: 6,
        },
      }}
    >
      {tabs.map(({ name, label, icon: Icon, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View style={{ opacity: focused ? 1 : 0.45 }}>
                <Icon size={23} color={color} />
              </View>
            ),
            tabBarLabel: ({ color }) => (
              <AppText
                style={{ fontFamily: fontFamily.outfitMedium, fontSize: 11, lineHeight: 13 }}
                color={color}
              >
                {label}
              </AppText>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
