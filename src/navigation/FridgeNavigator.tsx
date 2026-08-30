import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FridgeScreen } from '../screens/fridge/FridgeScreen';
import { AddProductScreen } from '../screens/fridge/AddProductScreen';
import { EditProductSheet } from '../screens/fridge/EditProductSheet';
import { RecognizedProductsScreen } from '../screens/fridge/RecognizedProductsScreen';
import { FridgeStackParamList } from './types';

const Stack = createNativeStackNavigator<FridgeStackParamList>();

export function FridgeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Fridge" component={FridgeScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="RecognizedProducts" component={RecognizedProductsScreen} />
      <Stack.Screen name="EditProduct" component={EditProductSheet} options={{ presentation: 'transparentModal', animation: 'fade' }} />
    </Stack.Navigator>
  );
}
