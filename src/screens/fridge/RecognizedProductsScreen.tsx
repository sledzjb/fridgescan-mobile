import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, X } from 'lucide-react-native';
import { AppText, Button, Card, ListRow, Stepper, Input } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { RecognizedItem } from '../../services/mockRecognition';
import { generateId } from '../../utils/id';
import { pluralizePl } from '../../utils/pluralize';
import { CATEGORIES } from '../../constants/fridge';
import { FridgeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FridgeStackParamList, 'RecognizedProducts'>;

const CONFIDENCE_THRESHOLD = 70;

export function RecognizedProductsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const addProduct = useProductsStore((s) => s.addProduct);
  const addHistoryEntry = useHistoryStore((s) => s.addEntry);
  const [items, setItems] = useState<(RecognizedItem & { confirmed?: boolean })[]>(route.params.items);
  const scannedCount = route.params.items.length;
  const uncertainCount = route.params.items.filter((it) => it.confidence < CONFIDENCE_THRESHOLD).length;

  const rescan = () => navigation.getParent()?.getParent()?.navigate('Scan' as never);

  const updateItem = (id: string, patch: Partial<RecognizedItem & { confirmed?: boolean }>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const addSkippedProduct = () => {
    setItems((prev) => [
      ...prev,
      { id: generateId(), name: '', category: CATEGORIES[0], confidence: 100, qty: 1, unit: 'szt' },
    ]);
  };

  const handleSave = () => {
    const toSave = items.filter((it) => it.name.trim().length > 0);
    toSave.forEach((it) => {
      addProduct({ name: it.name.trim(), category: it.category, qty: it.qty, unit: it.unit, expiryDate: null });
    });
    addHistoryEntry({
      type: 'scan',
      title: 'Skan lodówki',
      description:
        uncertainCount > 0
          ? `Rozpoznano ${scannedCount} ${pluralizePl(scannedCount, ['produkt', 'produkty', 'produktów'])}, ${uncertainCount} ${pluralizePl(uncertainCount, ['wymagał', 'wymagały', 'wymagało'])} potwierdzenia.`
          : `Rozpoznano ${scannedCount} ${pluralizePl(scannedCount, ['produkt', 'produkty', 'produktów'])}.`,
      actionLabel: 'Otwórz listę',
    });
    const message = toSave.length === 1 ? 'Zapisano 1 produkt do lodówki' : `Zapisano ${toSave.length} produktów do lodówki`;
    navigation.navigate('Fridge', { toastMessage: message });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.space4 }]}>
        <Pressable onPress={rescan} style={styles.back} hitSlop={8}>
          <ArrowLeft size={16} color={colors.mute} />
          <AppText style={styles.backLabel} color={colors.mute}>
            Skanuj ponownie
          </AppText>
        </Pressable>
        <AppText variant="h1" style={styles.title}>
          {`Rozpoznano ${items.length} produktów`}
        </AppText>
        <AppText variant="caption" color={colors.mute} style={styles.description}>
          Popraw ilości, usuń błędne pozycje, dodaj to, czego AI nie zauważyła. Poprawki uczą model Twoich zwyczajów.
        </AppText>
      </View>

      <Card style={styles.card}>
        {items.map((item, i) => (
          <RecognizedRow
            key={item.id}
            item={item}
            last={i === items.length - 1}
            onChangeName={(name) => updateItem(item.id, { name })}
            onChangeQty={(qty) => updateItem(item.id, { qty })}
            onConfirm={() => updateItem(item.id, { confirmed: true })}
            onReject={() => removeItem(item.id)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
        <ListRow title="+ Dodaj pominięty produkt" onPress={addSkippedProduct} last />
      </Card>

      <Button
        label="Zapisz do lodówki"
        variant="primary"
        onPress={handleSave}
        style={[styles.cta, { marginBottom: insets.bottom + spacing.space5 }]}
      />
    </View>
  );
}

function RecognizedRow({
  item,
  last,
  onChangeName,
  onChangeQty,
  onConfirm,
  onReject,
  onRemove,
}: {
  item: RecognizedItem & { confirmed?: boolean };
  last: boolean;
  onChangeName: (name: string) => void;
  onChangeQty: (qty: number) => void;
  onConfirm: () => void;
  onReject: () => void;
  onRemove: () => void;
}) {
  const isUncertain = item.confidence < CONFIDENCE_THRESHOLD;
  const needsConfirmation = isUncertain && !item.confirmed;

  const metaText = item.confirmed
    ? 'potwierdzone przez Ciebie'
    : isUncertain
      ? `pewność ${item.confidence}% · potwierdź`
      : `pewność ${item.confidence}%`;

  return (
    <View style={!last && styles.rowDivider}>
      <ListRow
        title=""
        titleElement={
          item.name === '' ? (
            <Input placeholder="Nazwa produktu" value={item.name} onChangeText={onChangeName} autoFocus style={styles.inlineInput} />
          ) : undefined
        }
        thumbnailFallbackLetter={item.name || '?'}
        thumbnailSize={36}
        meta={item.name === '' ? undefined : metaText}
        metaColor={needsConfirmation ? colors.secondary700 : colors.mute}
        rightElement={
          <View style={styles.editRow}>
            <Stepper value={item.qty} unit={item.unit} onChange={onChangeQty} />
            <Pressable onPress={onRemove} hitSlop={8}>
              <X size={18} color={colors.secondary700} />
            </Pressable>
          </View>
        }
        last
      />
      {needsConfirmation && (
        <View style={styles.confirmRow}>
          <ConfirmChip label={`Tak, to ${item.name}`} bg={colors.primary50} textColor={colors.primary700} onPress={onConfirm} />
          <ConfirmChip label="Nie, usuń" bg={colors.line} textColor={colors.ink} onPress={onReject} />
        </View>
      )}
    </View>
  );
}

function ConfirmChip({ label, bg, textColor, onPress }: { label: string; bg: string; textColor: string; onPress: () => void }) {
  return (
    <Pressable style={[styles.confirmChip, { backgroundColor: bg }]} onPress={onPress}>
      <AppText style={styles.confirmChipText} color={textColor}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: screenPaddingHorizontal,
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
  description: {
    marginTop: spacing.space2,
    fontSize: 13.5,
    lineHeight: 20,
  },
  card: {
    marginTop: spacing.space6,
    marginHorizontal: screenPaddingHorizontal,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
  },
  inlineInput: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14.5,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: spacing.space2,
    marginLeft: 48,
    marginTop: spacing.space2,
    marginBottom: spacing.space3,
  },
  confirmChip: {
    borderRadius: radius.pill,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  confirmChipText: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 13,
  },
  cta: {
    marginHorizontal: screenPaddingHorizontal,
    marginTop: spacing.space6,
  },
});
