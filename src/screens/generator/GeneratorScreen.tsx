import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Card } from '../../components';
import { colors, alpha, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { daysUntil } from '../../utils/date';
import { EXPIRY_SOON_THRESHOLD_DAYS } from '../../constants/fridge';
import { DEFAULT_FILTERS, GeneratorFilters, matchAllRecipes, filterRecipes } from '../../utils/recipeMatch';
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
        color={selected ? colors.white : colors.ink}
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
  value,
  onChange,
}: {
  kicker: string;
  note?: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.group}>
      <AppText variant="kicker" color={colors.mute} style={styles.groupKicker}>
        {kicker}
      </AppText>
      <View style={styles.groupRow}>
        {options.map((opt) => (
          <FilterOption key={opt} label={opt} selected={value === opt} onPress={() => onChange(opt)} />
        ))}
      </View>
      {note && (
        <AppText variant="caption" color={colors.mute} style={styles.groupNote}>
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

  const matches = matchAllRecipes(products);
  const resultCount = filterRecipes(matches, filters).length;
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
      <View style={[styles.content, { paddingTop: insets.top + spacing.space6 }]}>
        <AppText variant="h1">Generator przepisów</AppText>
        <AppText variant="caption" color={colors.mute} style={styles.description}>
          Wybierz preferencje. Pokażemy tylko przepisy, w których co najmniej 3 składniki masz w lodówce.
        </AppText>

        <FilterGroup
          kicker="RODZAJ POSIŁKU"
          options={['Śniadanie', 'Obiad', 'Kolacja'] as const}
          value={filters.meal}
          onChange={(v) => setFilter('meal', v)}
        />
        <FilterGroup
          kicker="PROFIL SMAKOWY"
          options={['Na słodko', 'Na słono'] as const}
          value={filters.taste}
          onChange={(v) => setFilter('taste', v)}
        />
        <FilterGroup
          kicker="POZIOM TRUDNOŚCI"
          note="Proste = także dla dzieci. Złożone = więcej kroków i technik."
          options={['Proste', 'Złożone'] as const}
          value={filters.difficulty}
          onChange={(v) => setFilter('difficulty', v)}
        />
        <FilterGroup
          kicker="DLA KOGO"
          options={['Dla dzieci', 'Dla dorosłych'] as const}
          value={filters.audience}
          onChange={(v) => setFilter('audience', v)}
        />

        <Card style={styles.baseCard} padding={spacing.space4}>
          <AppText variant="kicker" color={colors.mute}>
            BAZA
          </AppText>
          <AppText variant="body" style={styles.baseCardText}>
            {expiringSoonCount > 0
              ? `${products.length} w lodówce, ${expiringSoonCount} z nich kończą się w ciągu 2 dni. Damy im priorytet.`
              : `${products.length} w lodówce.`}
          </AppText>
        </Card>
      </View>

      <Pressable
        onPress={handleGenerate}
        style={[styles.cta, { marginBottom: insets.bottom + spacing.space5 }]}
      >
        <AppText style={styles.ctaLabel} color={colors.white}>
          Generuj propozycje
        </AppText>
        <AppText style={styles.ctaCount} color={alpha.whiteText60}>
          {`${resultCount} pasuje`}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary700,
  },
  filterOptionText: {
    fontSize: 13.5,
    textAlign: 'center',
  },
  baseCard: {
    marginTop: spacing.space6,
    marginBottom: spacing.space6,
  },
  baseCardText: {
    marginTop: spacing.space1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary700,
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: spacing.space4,
    marginHorizontal: screenPaddingHorizontal,
  },
  ctaLabel: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 15.5,
  },
  ctaCount: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 11.5,
  },
});
