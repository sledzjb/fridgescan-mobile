import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { BackArrow, AppText, Button, Input, Toggle, Toast, useToast } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useAppState } from '../../store/AppStateContext';
import { useProductsStore } from '../../store/useProductsStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { useRecipesStore } from '../../store/useRecipesStore';
import { useGenerationCacheStore } from '../../store/useGenerationCacheStore';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { useSettingsStore, NotificationPrefs } from '../../store/useSettingsStore';
import { requestNotificationPermission, cancelAllNotifications, syncProductExpiryNotification, SUPPORTS_NOTIFICATIONS } from '../../services/notifications';
import { pluralizePl } from '../../utils/pluralize';
import { confirmDestructive } from '../../utils/confirm';
import { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Settings'>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="kicker" color={colors.textMuted} style={styles.sectionTitle}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  last,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, !last && styles.toggleRowDivider]}>
      <View style={styles.toggleRowText}>
        <AppText style={styles.toggleRowLabel}>{label}</AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.toggleRowDescription}>
          {description}
        </AppText>
      </View>
      <Toggle value={value} onValueChange={onValueChange} />
    </View>
  );
}

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { name, setName, resetOnboarding, setNotificationsAsked } = useAppState();
  const products = useProductsStore((s) => s.products);
  const clearProducts = useProductsStore((s) => s.clearAll);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const favorites = useFavoritesStore((s) => s.recipeIds);
  const clearFavorites = useFavoritesStore((s) => s.clearAll);
  const history = useHistoryStore((s) => s.entries);
  const clearHistory = useHistoryStore((s) => s.clearAll);
  const shoppingItems = useShoppingListStore((s) => s.items);
  const clearShoppingList = useShoppingListStore((s) => s.clearAll);
  const { notifications, setNotificationPref, resetSettings } = useSettingsStore();
  const toast = useToast();
  const [localName, setLocalName] = useState(name);

  const dataSizeKb = Math.round(
    (JSON.stringify(products).length + JSON.stringify(favorites).length + JSON.stringify(history).length) / 1024
  );

  const handleNameBlur = () => setName(localName.trim());

  const handleNotificationToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    setNotificationPref(key, value);
    if (key === 'expiringSoon' && value) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
      products
        .filter((p) => p.expiryDate)
        .forEach((p) => {
          syncProductExpiryNotification(p.notificationId, p.name, p.expiryDate, true).then((notificationId) =>
            updateProduct(p.id, { notificationId })
          );
        });
    }
    if (key === 'expiringSoon' && !value) {
      products.forEach((p) => {
        if (p.notificationId) {
          syncProductExpiryNotification(p.notificationId, p.name, null, false).then(() =>
            updateProduct(p.id, { notificationId: null })
          );
        }
      });
    }
  };

  const handleExportCopy = async () => {
    const payload = { name, products, favorites, history, shoppingItems, notifications };
    await Clipboard.setStringAsync(JSON.stringify(payload, null, 2));
    toast.show('Kopia danych skopiowana do schowka');
  };

  const handleClearFridge = () => {
    confirmDestructive({
      title: 'Wyczyścić lodówkę?',
      message: 'Usunie wszystkie produkty. Tej operacji nie można cofnąć.',
      confirmLabel: 'Wyczyść',
      onConfirm: () => {
        cancelAllNotifications();
        clearProducts();
        toast.show('Lodówka wyczyszczona');
      },
    });
  };

  const handleShowIntroAgain = () => {
    resetOnboarding();
    navigation.getParent()?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Onboarding' }] }));
  };

  const handleDeleteEverything = () => {
    confirmDestructive({
      title: 'Usunąć wszystkie dane z telefonu?',
      message: 'Imię, produkty, ulubione, wygenerowane przepisy, historia, lista zakupów i ustawienia zostaną trwale usunięte.',
      confirmLabel: 'Usuń wszystko',
      onConfirm: () => {
        cancelAllNotifications();
        clearProducts();
        clearFavorites();
        clearHistory();
        clearShoppingList();
        useRecipesStore.setState({ recipes: [] });
        useGenerationCacheStore.setState({ results: {}, photos: {} });
        useSearchHistoryStore.getState().clearAll();
        resetSettings();
        setName('');
        setNotificationsAsked(false);
        resetOnboarding();
        navigation.getParent()?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Onboarding' }] }));
      },
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
          <BackArrow />
          <AppText style={styles.backLabel} color={colors.textMuted}>
            Więcej
          </AppText>
        </Pressable>

        <AppText variant="h1" style={styles.title}>
          Ustawienia i konto
        </AppText>

        <Section title="IMIĘ">
          <Input value={localName} onChangeText={setLocalName} onBlur={handleNameBlur} variant="onCard" />
        </Section>

        {SUPPORTS_NOTIFICATIONS && (
          <Section title="POWIADOMIENIA">
            <View style={styles.card}>
              <ToggleRow
                label="Produkty tracące świeżość"
                description="Powiadomienie 2 dni przed końcem terminu."
                value={notifications.expiringSoon}
                onValueChange={(v) => handleNotificationToggle('expiringSoon', v)}
                last
              />
            </View>
          </Section>
        )}

        <Section title="DANE NA TELEFONIE">
          <AppText variant="label">{`Lokalne dane (AsyncStorage) - ~${dataSizeKb} KB`}</AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
            {`${products.length} ${pluralizePl(products.length, ['produkt', 'produkty', 'produktów'])}, ${favorites.length} ${pluralizePl(favorites.length, ['ulubiony przepis', 'ulubione przepisy', 'ulubionych przepisów'])}, ${history.length} ${pluralizePl(history.length, ['wpis historii', 'wpisy historii', 'wpisów historii'])}. Dane są zapisane tylko na tym telefonie. Szczegóły, co wysyłamy do usług zewnętrznych, są w Pomocy.`}
          </AppText>
          <View style={styles.dataButtons}>
            <Pressable style={styles.dataButton} onPress={handleExportCopy}>
              <AppText style={styles.dataButtonText}>Eksportuj kopię</AppText>
            </Pressable>
            <Pressable style={styles.dataButton} onPress={handleClearFridge}>
              <AppText style={styles.dataButtonText}>Wyczyść lodówkę</AppText>
            </Pressable>
          </View>
        </Section>

        <View style={styles.links}>
          <Pressable style={styles.linkRow} onPress={handleShowIntroAgain}>
            <AppText variant="body">Pokaż wprowadzenie ponownie</AppText>
          </Pressable>
          <Pressable style={styles.linkRow} onPress={handleDeleteEverything}>
            <AppText variant="body" color={colors.error}>
              Usuń wszystkie dane z telefonu
            </AppText>
          </Pressable>
        </View>
      </ScrollView>

      <Toast visible={toast.visible} message={toast.message} onHide={toast.hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginBottom: spacing.space2,
  },
  section: {
    marginTop: spacing.space6,
  },
  sectionTitle: {
    marginBottom: spacing.space3,
  },
  hint: {
    marginTop: spacing.space2,
    lineHeight: 18,
  },
  fullWidth: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
    paddingVertical: 14,
  },
  toggleRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleRowText: {
    flex: 1,
  },
  toggleRowLabel: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14,
    color: colors.text,
  },
  toggleRowDescription: {
    marginTop: 2,
    lineHeight: 16,
  },
  dataButtons: {
    flexDirection: 'row',
    gap: spacing.space2,
    marginTop: spacing.space4,
  },
  dataButton: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dataButtonText: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 13,
    color: colors.text,
  },
  links: {
    marginTop: spacing.space7,
  },
  linkRow: {
    paddingVertical: spacing.space3,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
