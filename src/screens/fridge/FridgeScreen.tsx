import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, PencilLine, Refrigerator, X } from 'lucide-react-native';
import { AppText, Button, Card, ListRow, Badge, Stepper, Chip, Toast, useToast } from '../../components';
import { colors, spacing, radius, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useAppState } from '../../store/AppStateContext';
import { useProductsStore, Product } from '../../store/useProductsStore';
import { daysUntil, expiryLabel } from '../../utils/date';
import { formatQuantity } from '../../utils/quantity';
import { EXPIRY_SOON_THRESHOLD_DAYS } from '../../constants/fridge';
import { FridgeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FridgeStackParamList, 'Fridge'>;

const STARTER_SUGGESTIONS = ['Ziemniaki', 'Cebula', 'Twaróg', 'Śmietana 30%', 'Pomidory', 'Ryż'];

export function FridgeScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { name } = useAppState();
  const products = useProductsStore((s) => s.products);
  const setQuantity = useProductsStore((s) => s.setQuantity);
  const removeProduct = useProductsStore((s) => s.removeProduct);
  const restoreProduct = useProductsStore((s) => s.restoreProduct);
  const [editMode, setEditMode] = useState(false);
  const toast = useToast();
  const [pendingUndo, setPendingUndo] = useState<{ product: Product; index: number } | null>(null);

  // Toast przekazany parametrami po powrocie z Dodaj produkt / arkusza edycji.
  useEffect(() => {
    if (route.params?.toastMessage) {
      toast.show(route.params.toastMessage);
      if (route.params.undoProduct && route.params.undoIndex !== undefined) {
        setPendingUndo({ product: route.params.undoProduct, index: route.params.undoIndex });
      }
      navigation.setParams({ toastMessage: undefined, undoProduct: undefined, undoIndex: undefined });
    }
  }, [route.params?.toastMessage]);

  const openScan = () => navigation.getParent()?.getParent()?.navigate('Scan' as never);
  const openGenerator = () => navigation.getParent()?.navigate('GeneratorTab' as never);

  const expiringSoon = products.filter(
    (p) => p.expiryDate && daysUntil(p.expiryDate) <= EXPIRY_SOON_THRESHOLD_DAYS
  );

  const handleDelete = (product: Product) => {
    const removed = removeProduct(product.id);
    if (!removed) return;
    setPendingUndo(removed);
    toast.show(`Usunięto »${product.name}« z lodówki`);
  };

  const handleUndo = () => {
    if (pendingUndo) {
      restoreProduct(pendingUndo.product, pendingUndo.index);
      setPendingUndo(null);
    }
    toast.hide();
  };

  const isEmpty = products.length === 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.space6, paddingBottom: insets.bottom + spacing.space9 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <AppText variant="kicker" color={colors.primary700}>
              {name.trim() ? `CZEŚĆ, ${name.trim().toUpperCase()}` : 'CZEŚĆ'}
            </AppText>
            <AppText variant="h1" style={styles.title}>
              Lodówka
            </AppText>
            <AppText variant="meta" color={colors.mute} style={styles.meta}>
              {isEmpty ? 'pusto · brak skanów' : `${products.length} produktów`}
            </AppText>
          </View>
          {!isEmpty && (
            <Pressable onPress={() => setEditMode((v) => !v)} hitSlop={8}>
              <AppText style={styles.editToggle} color={colors.primary700}>
                {editMode ? 'Gotowe' : 'Edytuj'}
              </AppText>
            </Pressable>
          )}
        </View>

        {!isEmpty && (
          <>
            <View style={styles.tiles}>
              <Pressable style={[styles.tile, styles.tilePrimary]} onPress={openScan}>
                <Camera size={22} color={colors.white} />
                <AppText style={[styles.tileLabel, { color: colors.white }]}>Zrób zdjęcie</AppText>
                <AppText style={[styles.tileDesc, { color: 'rgba(255,255,255,.72)' }]}>
                  AI rozpozna produkty
                </AppText>
              </Pressable>
              <Pressable style={styles.tile} onPress={openScan}>
                <ImageIcon size={22} color={colors.ink} />
                <AppText style={styles.tileLabel}>Z galerii</AppText>
                <AppText style={[styles.tileDesc, { color: colors.mute }]}>wybierz zdjęcie</AppText>
              </Pressable>
              <Pressable style={styles.tile} onPress={() => navigation.navigate('AddProduct', {})}>
                <PencilLine size={22} color={colors.ink} />
                <AppText style={styles.tileLabel}>Ręcznie</AppText>
                <AppText style={[styles.tileDesc, { color: colors.mute }]}>wpisz produkt</AppText>
              </Pressable>
            </View>

            {expiringSoon.length > 0 && (
              <View style={styles.section}>
                <AppText variant="kicker" color={colors.mute} style={styles.sectionTitle}>
                  ZUŻYJ WKRÓTCE
                </AppText>
                <Card>
                  {expiringSoon.map((p, i) => (
                    <ListRow
                      key={p.id}
                      title={p.name}
                      thumbnailFallbackLetter={p.name}
                      thumbnailSize={36}
                      value={formatQuantity(p.qty, p.unit)}
                      metaElement={<Badge label={expiryLabel(p.expiryDate!)} variant="expiry" />}
                      onPress={() => navigation.navigate('EditProduct', { productId: p.id })}
                      last={i === expiringSoon.length - 1}
                    />
                  ))}
                </Card>
              </View>
            )}

            <View style={styles.section}>
              <AppText variant="kicker" color={colors.mute} style={styles.sectionTitle}>
                WSZYSTKIE PRODUKTY
              </AppText>
              <Card>
                {products.map((p, i) => (
                  <ListRow
                    key={p.id}
                    title={p.name}
                    meta={p.category}
                    thumbnailFallbackLetter={p.name}
                    onPress={editMode ? undefined : () => navigation.navigate('EditProduct', { productId: p.id })}
                    rightElement={
                      editMode ? (
                        <View style={styles.editRow}>
                          <Stepper value={p.qty} unit={p.unit} onChange={(qty) => setQuantity(p.id, qty)} />
                          <Pressable onPress={() => handleDelete(p)} hitSlop={8}>
                            <X size={18} color={colors.secondary700} />
                          </Pressable>
                        </View>
                      ) : undefined
                    }
                    value={editMode ? undefined : formatQuantity(p.qty, p.unit)}
                    last={false}
                  />
                ))}
                <ListRow
                  title="+ Dodaj produkt ręcznie"
                  onPress={() => navigation.navigate('AddProduct', {})}
                  last
                />
              </Card>
            </View>

            <Button
              label="Generuj przepisy z tej lodówki"
              variant="secondary"
              onPress={openGenerator}
              style={styles.cta}
            />
          </>
        )}

        {isEmpty && (
          <>
            <Card style={styles.emptyCard} radius={20} padding={0}>
              <View style={styles.emptyCardInner}>
                <View style={styles.emptyIconTile}>
                  <Refrigerator size={26} color={colors.primary700} />
                </View>
                <AppText variant="h3" style={styles.emptyTitle}>
                  Twoja lodówka jest pusta
                </AppText>
                <AppText variant="caption" color={colors.mute} style={styles.emptyDescription}>
                  Zrób jedno zdjęcie wnętrza — AI rozpozna produkty i od razu podpowie przepisy. Możesz też wpisać
                  kilka rzeczy ręcznie.
                </AppText>
                <Button
                  label="Zrób zdjęcie lodówki"
                  variant="accentAction"
                  onPress={openScan}
                  style={styles.fullWidth}
                />
                <Button
                  label="Dodam produkty ręcznie"
                  variant="tertiary"
                  onPress={() => navigation.navigate('AddProduct', {})}
                />
              </View>
            </Card>

            <View style={styles.section}>
              <AppText variant="kicker" color={colors.mute} style={styles.sectionTitle}>
                ZACZNIJ OD PODSTAW
              </AppText>
              <View style={styles.suggestions}>
                {STARTER_SUGGESTIONS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    state="suggestion"
                    onPress={() => navigation.navigate('AddProduct', { initialName: s })}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        actionLabel={pendingUndo ? 'Cofnij' : undefined}
        onActionPress={handleUndo}
        onHide={() => {
          setPendingUndo(null);
          toast.hide();
        }}
      />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  title: {
    marginTop: spacing.space1,
  },
  meta: {
    marginTop: spacing.space2,
  },
  editToggle: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 13,
  },
  tiles: {
    flexDirection: 'row',
    gap: 9,
    marginTop: spacing.space6,
  },
  tile: {
    flex: 1,
    borderRadius: radius.lg,
    padding: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
  },
  tilePrimary: {
    backgroundColor: colors.accent600,
    borderWidth: 0,
  },
  tileLabel: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
    color: colors.ink,
  },
  tileDesc: {
    fontFamily: fontFamily.outfitRegular,
    fontSize: 11.5,
    lineHeight: 14,
  },
  section: {
    marginTop: spacing.space6,
  },
  sectionTitle: {
    marginBottom: spacing.space3,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
  },
  cta: {
    marginTop: spacing.space7,
  },
  emptyCard: {
    marginTop: spacing.space6,
    borderStyle: 'dashed',
  },
  emptyCardInner: {
    paddingVertical: 34,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: spacing.space3,
  },
  emptyIconTile: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space2,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: spacing.space2,
  },
  fullWidth: {
    width: '100%',
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space2,
  },
});
