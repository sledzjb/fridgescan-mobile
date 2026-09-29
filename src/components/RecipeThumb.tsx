import React, { useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ChefHat } from 'lucide-react-native';
import { colors } from '../theme';

type Props = {
  imageUrl?: string;
  iconSize: number;
  style: StyleProp<ViewStyle>;
};

/** Miniaturka przepisu: zdjęcie, a gdy go brak albo się nie wczyta - ikona szefa kuchni. */
export function RecipeThumb({ imageUrl, iconSize, style }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = !!imageUrl && !failed;

  return (
    <View style={[style, styles.clip]}>
      {showImage ? (
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" onError={() => setFailed(true)} />
      ) : (
        <ChefHat size={iconSize} color={colors.primary} strokeWidth={1.5} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
