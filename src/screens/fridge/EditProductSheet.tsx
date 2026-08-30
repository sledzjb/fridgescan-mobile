import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, Input, Chip, BottomSheet } from '../../components';
import { colors, spacing, fontFamily } from '../../theme';
import { useProductsStore } from '../../store/useProductsStore';
import { CATEGORIES, UNITS } from '../../constants/fridge';
import { formatIsoToPl, parsePlToIso, IsoDate } from '../../utils/date';
import { FridgeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FridgeStackParamList, 'EditProduct'>;

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

export function EditProductSheet({ navigation, route }: Props) {
  const product = useProductsStore((s) => s.products.find((p) => p.id === route.params.productId));
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const removeProduct = useProductsStore((s) => s.removeProduct);

  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState<string | null>(product?.category ?? null);
  const [qty, setQty] = useState(String(product?.qty ?? 1));
  const [unit, setUnit] = useState<string>(product?.unit ?? UNITS[0]);
  const [expiryIso, setExpiryIso] = useState<IsoDate | null>(product?.expiryDate ?? null);
  const [dateText, setDateText] = useState(product?.expiryDate ? formatIsoToPl(product.expiryDate) : '');

  useEffect(() => {
    if (!product) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (!product) {
    return null;
  }

  const handleDateTextChange = (text: string) => {
    setDateText(text);
    setExpiryIso(parsePlToIso(text));
  };

  const handleClose = () => navigation.goBack();

  const handleSave = () => {
    const trimmedName = name.trim() || product.name;
    const parsedQty = Math.max(0, Number(qty.replace(',', '.')) || 0);
    updateProduct(product.id, {
      name: trimmedName,
      category: category ?? product.category,
      qty: parsedQty,
      unit,
      expiryDate: expiryIso,
    });
    navigation.navigate('Fridge', { toastMessage: `Zapisano zmiany w »${trimmedName}«` });
  };

  const handleDelete = () => {
    const removed = removeProduct(product.id);
    navigation.navigate('Fridge', {
      toastMessage: `Usunięto »${product.name}« z lodówki`,
      undoProduct: removed?.product,
      undoIndex: removed?.index,
    });
  };

  return (
    <BottomSheet visible onClose={handleClose}>
      <View style={styles.header}>
        <AppText variant="h3">Edytuj produkt</AppText>
        <Pressable onPress={handleClose} hitSlop={8}>
          <AppText style={styles.close} color={colors.mute}>
            Zamknij
          </AppText>
        </Pressable>
      </View>

      <Input placeholder="Nazwa" value={name} onChangeText={setName} style={styles.nameInput} />

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

      <Section title="DATA WAŻNOŚCI">
        <Input placeholder="DD.MM.RRRR" value={dateText} onChangeText={handleDateTextChange} />
      </Section>

      <View style={styles.actions}>
        <Button
          label="Usuń"
          variant="outline"
          textColor={colors.secondary700}
          onPress={handleDelete}
          style={styles.deleteButton}
        />
        <Button label="Zapisz" variant="primary" onPress={handleSave} style={styles.saveButton} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 13.5,
  },
  nameInput: {
    marginTop: spacing.space4,
  },
  section: {
    marginTop: spacing.space5,
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
  actions: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space6,
  },
  deleteButton: {},
  saveButton: {
    flex: 1,
  },
});
