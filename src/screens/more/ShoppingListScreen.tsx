import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft } from 'lucide-react-native';
import { AppText, Button, Checkbox, Input, BottomSheet, Toast, useToast } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'ShoppingList'>;

export function ShoppingListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const items = useShoppingListStore((s) => s.items);
  const toggleChecked = useShoppingListStore((s) => s.toggleChecked);
  const purgeChecked = useShoppingListStore((s) => s.purgeChecked);
  const addManual = useShoppingListStore((s) => s.addManual);
  const toast = useToast();
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');

  // Odhaczone pozycje znikają dopiero, gdy opuszczamy ekran (skończyliśmy zakupy) —
  // podczas przeglądania listy zostają widoczne z przekreśleniem.
  useEffect(() => {
    return () => purgeChecked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uncheckedCount = items.filter((i) => !i.checked).length;

  const handleShare = async () => {
    const text = items.map((i) => `- ${i.name} (${i.qty})`).join('\n');
    await Clipboard.setStringAsync(text);
    toast.show('Lista skopiowana do schowka');
  };

  const handleAddManual = () => {
    if (!newName.trim()) return;
    addManual(newName.trim(), newQty.trim() || '1 szt');
    setNewName('');
    setNewQty('');
    setAddSheetOpen(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
          <ArrowLeft size={16} color={colors.mute} />
          <AppText style={styles.backLabel} color={colors.mute}>
            Więcej
          </AppText>
        </Pressable>

        <AppText variant="h1" style={styles.title}>
          Lista zakupów
        </AppText>
        <AppText variant="meta" color={colors.mute} style={styles.meta}>
          {`${uncheckedCount} z ${items.length} do kupienia`}
        </AppText>
        <AppText variant="caption" color={colors.mute} style={styles.description}>
          Zebrane automatycznie z przepisów, w których brakowało Ci składników. Odhaczone znikną po zakupach.
        </AppText>

        <View style={styles.list}>
          {items.map((item, i) => (
            <View key={item.id} style={[styles.row, i > 0 && styles.rowDivider]}>
              <Checkbox value={item.checked} onValueChange={() => toggleChecked(item.id)} />
              <View style={styles.rowText}>
                <AppText
                  style={[styles.rowName, item.checked && styles.rowNameChecked]}
                  color={item.checked ? colors.mute : colors.ink}
                >
                  {item.name}
                </AppText>
                {item.recipeName && (
                  <AppText variant="caption" color={colors.mute} style={styles.rowRecipe}>
                    {`na: ${item.recipeName}`}
                  </AppText>
                )}
              </View>
              <AppText variant="meta" color={colors.mute}>
                {item.qty}
              </AppText>
            </View>
          ))}
          {items.length === 0 && (
            <AppText variant="caption" color={colors.mute} style={styles.emptyText}>
              Lista jest pusta. Pozycje pojawią się tu automatycznie, gdy otworzysz przepis z brakującym
              składnikiem.
            </AppText>
          )}
        </View>

        <View style={styles.actions}>
          <Button label="Udostępnij listę" variant="secondary" onPress={handleShare} style={styles.shareButton} />
          <Button label="Dodaj pozycję" variant="outline" onPress={() => setAddSheetOpen(true)} />
        </View>
      </ScrollView>

      <BottomSheet visible={addSheetOpen} onClose={() => setAddSheetOpen(false)}>
        <AppText variant="h3">Dodaj pozycję</AppText>
        <Input placeholder="Nazwa" value={newName} onChangeText={setNewName} style={styles.sheetInput} autoFocus />
        <Input placeholder="Ilość, np. 200 g" value={newQty} onChangeText={setNewQty} style={styles.sheetInput} />
        <Button label="Dodaj" variant="primary" disabled={!newName.trim()} onPress={handleAddManual} style={styles.fullWidth} />
      </BottomSheet>

      <Toast visible={toast.visible} message={toast.message} onHide={toast.hide} />
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
  meta: {
    marginTop: spacing.space2,
  },
  description: {
    marginTop: spacing.space2,
    lineHeight: 18,
  },
  list: {
    marginTop: spacing.space5,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
  },
  rowNameChecked: {
    textDecorationLine: 'line-through',
  },
  rowRecipe: {
    marginTop: 2,
    fontSize: 11.5,
    lineHeight: 15,
  },
  emptyText: {
    paddingVertical: spacing.space4,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space6,
  },
  shareButton: {
    flex: 1,
  },
  sheetInput: {
    marginTop: spacing.space4,
  },
  fullWidth: {
    width: '100%',
    marginTop: spacing.space5,
  },
});
