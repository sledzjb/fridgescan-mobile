import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { AppText, Button, Input, Chip } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { syncProductExpiryNotification } from '../../services/notifications';
import { CATEGORIES, UNITS, EXPIRY_PRESETS } from '../../constants/fridge';
import { addDaysIso, formatIsoToPl, parsePlToIso, IsoDate } from '../../utils/date';
import { FridgeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FridgeStackParamList, 'AddProduct'>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="kicker" color={colors.primary700} style={styles.sectionTitle}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

export function AddProductScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const expiringSoonEnabled = useSettingsStore((s) => s.notifications.expiringSoon);

  const [name, setName] = useState(route.params?.initialName ?? '');
  const [category, setCategory] = useState<string | null>(null);
  const [qty, setQty] = useState('1');
  const [unit, setUnit] = useState<string>(UNITS[0]);
  const [expiryIso, setExpiryIso] = useState<IsoDate | null>(null);
  const [dateText, setDateText] = useState('');

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0;

  const applyPreset = (days: number) => {
    const iso = addDaysIso(days);
    setExpiryIso(iso);
    setDateText(formatIsoToPl(iso));
  };

  const clearDate = () => {
    setExpiryIso(null);
    setDateText('');
  };

  const handleDateTextChange = (text: string) => {
    setDateText(text);
    setExpiryIso(parsePlToIso(text));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const parsedQty = Math.max(0, Number(qty.replace(',', '.')) || 0);
    const newProduct = addProduct({
      name: trimmedName,
      category: category ?? CATEGORIES[0],
      qty: parsedQty,
      unit,
      expiryDate: expiryIso,
    });
    if (expiryIso) {
      syncProductExpiryNotification(null, trimmedName, expiryIso, expiringSoonEnabled).then((notificationId) => {
        if (notificationId) updateProduct(newProduct.id, { notificationId });
      });
    }
    navigation.navigate('Fridge', { toastMessage: `Dodano »${trimmedName}« do lodówki` });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
          <ArrowLeft size={16} color={colors.mute} />
          <AppText style={styles.backLabel} color={colors.mute}>
            Lodówka
          </AppText>
        </Pressable>

        <AppText variant="h1" style={styles.title}>
          Dodaj produkt
        </AppText>

        <Section title="NAZWA">
          <Input placeholder="np. Pomidory" value={name} onChangeText={setName} autoFocus={!route.params?.initialName} />
        </Section>

        <Section title="KATEGORIA">
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} state={category === c ? 'selected' : 'default'} onPress={() => setCategory(c)} />
            ))}
          </View>
        </Section>

        <Section title="ILOŚĆ">
          <View style={styles.chipRow}>
            <Input value={qty} onChangeText={setQty} variant="numeric" keyboardType="numeric" />
            {UNITS.map((u) => (
              <Chip key={u} label={u} state={unit === u ? 'selected' : 'default'} onPress={() => setUnit(u)} />
            ))}
          </View>
        </Section>

        <Section title="DATA WAŻNOŚCI - OPCJONALNIE">
          <View style={styles.chipRow}>
            {EXPIRY_PRESETS.map((preset) => (
              <Chip key={preset.label} label={preset.label} onPress={() => applyPreset(preset.days)} />
            ))}
            <Chip label="bez daty" state={!expiryIso ? 'selected' : 'default'} onPress={clearDate} />
          </View>
          <Input
            placeholder="DD.MM.RRRR"
            value={dateText}
            onChangeText={handleDateTextChange}
            style={styles.dateInput}
          />
          <AppText variant="caption" color={colors.mute} style={styles.hint}>
            {expiryIso
              ? 'Powiadomimy Cię 2 dni przed tą datą.'
              : 'Bez daty produkt nie trafi do sekcji »Zużyj wkrótce«.'}
          </AppText>
        </Section>

        <Section title="PODPOWIEDZI AI">
          <View style={styles.chipRow}>
            <Chip label="Kategoria: Warzywa?" onPress={() => {}} disabled />
            <Chip label="Termin: ok. 5 dni?" onPress={() => {}} disabled />
          </View>
        </Section>

        <Button
          label="Dodaj do lodówki"
          variant="primary"
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={styles.cta}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: spacing.space9,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backLabel: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 13,
  },
  title: {
    marginTop: spacing.space3,
  },
  section: {
    marginTop: spacing.space6,
  },
  sectionTitle: {
    marginBottom: spacing.space3,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
    alignItems: 'center',
  },
  dateInput: {
    marginTop: spacing.space3,
  },
  hint: {
    marginTop: spacing.space2,
  },
  cta: {
    marginTop: spacing.space7,
  },
});
