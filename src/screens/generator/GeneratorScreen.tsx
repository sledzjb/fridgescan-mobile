import React, { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Card } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { daysUntil } from '../../utils/date';
import { EXPIRY_SOON_THRESHOLD_DAYS } from '../../constants/fridge';
import { pluralizePl } from '../../utils/pluralize';
import { recipeLabel } from '../../constants/recipeLabels';
import { MEALS, TASTES, DIFFICULTIES, DIET_CATEGORIES } from '../../data/recipes';
import { DEFAULT_FILTERS, GeneratorFilters } from '../../utils/recipeMatch';
import { GeneratorStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<GeneratorStackParamList, 'Generator'>;

function FilterOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterOption, selected ? styles.filterOptionSelected : styles.filterOptionDefault]}
    >
      <AppText
        style={[styles.filterOptionText, { fontFamily: selected ? fontFamily.outfitSemiBold : fontFamily.outfitMedium }]}
        color={selected ? colors.onPrimary : colors.text}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

function FilterGroup<T extends string>({
  kicker,
  note,
  options,
  labelFor,
  value,
  onChange,
}: {
  kicker: string;
  note?: string;
  options: readonly T[];
  labelFor: (value: T) => string;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.group}>
      <AppText variant="kicker" color={colors.textMuted} style={styles.groupKicker}>
        {kicker}
      </AppText>
      <View style={styles.groupRow}>
        {options.map((opt) => (
          <FilterOption key={opt} label={labelFor(opt)} selected={value === opt} onPress={() => onChange(opt)} />
        ))}
      </View>
      {note && (
        <AppText variant="caption" color={colors.textMuted} style={styles.groupNote}>
          {note}
        </AppText>
      )}
    </View>
  );
}

export function GeneratorScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const products = useProductsStore((s) => s.products);
  const [filters, setFilters] = useState<GeneratorFilters>(DEFAULT_FILTERS);

  const expiringSoonCount = products.filter(
    (p) => p.expiryDate && daysUntil(p.expiryDate) <= EXPIRY_SOON_THRESHOLD_DAYS
  ).length;

  const setFilter = <K extends keyof GeneratorFilters>(key: K, value: GeneratorFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    navigation.navigate('GeneratorLoading', { filters });
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space6 }]}>
        <AppText variant="h1">Generator przepisów</AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.description}>
          Wybierz preferencje. Wygenerujemy przepisy z tego, co masz w lodówce.
        </AppText>

        <FilterGroup
          kicker="RODZAJ POSIŁKU"
          options={MEALS}
          labelFor={recipeLabel}
          value={filters.meal}
          onChange={(v) => setFilter('meal', v)}
        />
        <FilterGroup
          kicker="PROFIL SMAKOWY"
          options={TASTES}
          labelFor={recipeLabel}
          value={filters.taste}
          onChange={(v) => setFilter('taste', v)}
        />
        <FilterGroup
          kicker="POZIOM TRUDNOŚCI"
          note="Proste = także dla dzieci. Złożone = więcej kroków i technik."
          options={DIFFICULTIES}
          labelFor={recipeLabel}
          value={filters.difficulty}
          onChange={(v) => setFilter('difficulty', v)}
        />
        <FilterGroup
          kicker="DIETA"
          options={DIET_CATEGORIES}
          labelFor={recipeLabel}
          value={filters.diet}
          onChange={(v) => setFilter('diet', v)}
        />

        <Card style={styles.baseCard} padding={spacing.space4}>
          <AppText variant="kicker" color={colors.textMuted}>
            BAZA
          </AppText>
          <AppText variant="body" style={styles.baseCardText}>
            {expiringSoonCount > 0
              ? `${products.length} w lodówce, ${expiringSoonCount} z nich ${pluralizePl(expiringSoonCount, ['kończy się', 'kończą się', 'kończy się'])} w ciągu 2 dni. Damy im priorytet.`
              : `${products.length} w lodówce.`}
          </AppText>
        </Card>
      </ScrollView>

      <Pressable
        onPress={handleGenerate}
        style={[styles.cta, { marginBottom: insets.bottom + spacing.space5 }]}
      >
        <AppText style={styles.ctaLabel} color={colors.onPrimary}>
          Generuj propozycje
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: screenPaddingHorizontal,
  },
  description: {
    marginTop: spacing.space2,
    fontSize: 13.5,
    lineHeight: 20,
  },
  group: {
    marginTop: spacing.space5,
  },
  groupKicker: {
    marginBottom: spacing.space2,
  },
  groupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
  },
  groupNote: {
    marginTop: spacing.space2,
    fontSize: 11.5,
    lineHeight: 15,
  },
  filterOption: {
    flex: 1,
    minWidth: 88,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOptionDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 13.5,
    textAlign: 'center',
  },
  baseCard: {
    marginTop: spacing.space6,
    marginBottom: spacing.space4,
  },
  baseCardText: {
    marginTop: spacing.space1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: spacing.space4,
    marginHorizontal: screenPaddingHorizontal,
    marginTop: spacing.space3,
  },
  ctaLabel: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15.5,
  },
});
