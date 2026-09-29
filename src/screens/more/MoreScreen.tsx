import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { AppText } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { pluralizePl } from '../../utils/pluralize';
import { SUPPORTS_NOTIFICATIONS } from '../../services/notifications';
import { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'More'>;

export function MoreScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const missingCount = useShoppingListStore((s) => s.items.filter((i) => !i.checked).length);

  const rows: { label: string; description: string; onPress?: () => void }[] = [
    {
      label: 'Lista zakupów',
      description:
        missingCount > 0
          ? `${missingCount} ${pluralizePl(missingCount, ['pozycja', 'pozycje', 'pozycji'])} do kupienia`
          : 'Pusta - dodawaj brakujące składniki z przepisów',
      onPress: () => navigation.navigate('ShoppingList'),
    },
    {
      label: 'Historia',
      description: 'Skany i wygenerowane listy',
      onPress: () => navigation.navigate('History'),
    },
    {
      label: 'Ustawienia i konto',
      description: SUPPORTS_NOTIFICATIONS ? 'Imię, powiadomienia, dane na telefonie' : 'Imię, dane na telefonie',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      label: 'Pomoc',
      description: 'FAQ i informacje o danych',
      onPress: () => navigation.navigate('Help'),
    },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space6 }]}>
      <AppText variant="h1" style={styles.title}>
        Więcej
      </AppText>

      <View style={styles.list}>
        {rows.map((row, i) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={[styles.row, i > 0 && styles.rowDivider]}
          >
            <View style={styles.rowText}>
              <AppText style={styles.rowLabel}>{row.label}</AppText>
              <AppText variant="caption" color={colors.textMuted} style={styles.rowDescription}>
                {row.description}
              </AppText>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: screenPaddingHorizontal,
  },
  title: {
    marginBottom: spacing.space5,
  },
  list: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15,
    color: colors.text,
  },
  rowDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
  },
});
