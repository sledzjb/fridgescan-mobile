import React from 'react';
import { Pressable, View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { AppText } from './AppText';
import { colors, fontFamily } from '../theme';

export type ListRowProps = {
  title: string;
  /** Zastępuje statyczny tytuł (np. Input do edycji nazwy inline). */
  titleElement?: React.ReactNode;
  meta?: string;
  metaColor?: string;
  /** Zastępuje domyślny tekstowy meta (np. Badge terminu ważności pod nazwą). */
  metaElement?: React.ReactNode;
  value?: string;
  thumbnailUri?: string;
  thumbnailFallbackLetter?: string;
  thumbnailSize?: number;
  chevron?: boolean;
  /** Zastępuje domyślną wartość po prawej (np. stepper + × w trybie edycji). */
  rightElement?: React.ReactNode;
  onPress?: () => void;
  /** Ostatni wiersz w kontenerze nie rysuje separatora na dole. */
  last?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ListRow({
  title,
  titleElement,
  meta,
  metaColor = colors.mute,
  metaElement,
  value,
  thumbnailUri,
  thumbnailFallbackLetter,
  thumbnailSize = 34,
  chevron,
  rightElement,
  onPress,
  last,
  style,
}: ListRowProps) {
  const content = (
    <>
      {(thumbnailUri || thumbnailFallbackLetter) && (
        <Thumbnail uri={thumbnailUri} letter={thumbnailFallbackLetter} size={thumbnailSize} />
      )}
      <View style={styles.textCol}>
        {titleElement ?? (
          <AppText variant="label" numberOfLines={1}>
            {title}
          </AppText>
        )}
        {metaElement && <View style={styles.meta}>{metaElement}</View>}
        {!metaElement && meta && (
          <AppText variant="meta" color={metaColor} style={styles.meta}>
            {meta}
          </AppText>
        )}
      </View>
      {rightElement ??
        (value && (
          <AppText variant="meta" color={colors.mute} style={styles.value}>
            {value}
          </AppText>
        ))}
      {chevron && <ChevronRight size={20} color={colors.mute} />}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed, style]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, !last && styles.divider, style]}>{content}</View>;
}

function Thumbnail({ uri, letter, size }: { uri?: string; letter?: string; size: number }) {
  if (uri) {
    return (
      <View style={[styles.thumb, { width: size, height: size, backgroundColor: colors.white }]}>
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={[styles.thumb, { width: size, height: size, backgroundColor: colors.primary50 }]}>
      <AppText style={[styles.thumbLetter, { fontFamily: fontFamily.outfitSemiBold }]} color={colors.primary700}>
        {(letter ?? '?').charAt(0).toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  pressed: {
    opacity: 0.7,
  },
  thumb: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbLetter: {
    fontSize: 13,
  },
  textCol: {
    flex: 1,
  },
  meta: {
    marginTop: 2,
  },
  value: {
    fontSize: 11.5,
  },
});
