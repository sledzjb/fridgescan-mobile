import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff, TriangleAlert } from 'lucide-react-native';
import { BackArrow, AppText, Button, Card } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { ScanStackParamList } from '../../navigation/types';
import { describeError } from '../../utils/errorMessages';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanError'>;

export function ScanErrorScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const code = route.params?.code ?? 'NETWORK';
  const { title, description, offline } = describeError(code);
  const time = useMemo(
    () => new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    []
  );

  const openAddProductInFridge = () => {
    navigation
      .getParent()
      ?.navigate('MainTabs', { screen: 'FridgeTab', params: { screen: 'AddProduct' } } as never);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space4 }]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <BackArrow />
        <AppText style={styles.backLabel} color={colors.textMuted}>
          Skanuj ponownie
        </AppText>
      </Pressable>

      <Card style={styles.card} radius={20} padding={0}>
        <View style={styles.cardInner}>
          <View style={styles.iconTile}>
            {offline ? (
              <WifiOff size={24} color={colors.onErrorSoft} />
            ) : (
              <TriangleAlert size={24} color={colors.onErrorSoft} />
            )}
          </View>
          <AppText variant="h3" style={styles.title}>
            {title}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.description}>
            {description}
          </AppText>

          <View style={styles.techBlock}>
            <AppText style={styles.techText} color={colors.textMuted}>
              {`błąd: ${code} · ${time}`}
            </AppText>
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button label="Spróbuj ponownie" variant="primary" onPress={() => navigation.goBack()} style={styles.fullWidth} />
        <Button label="Dodaj produkty ręcznie" variant="tertiary" onPress={openAddProductInFridge} />
      </View>

      <View style={styles.offlineSection}>
        <AppText variant="kicker" color={colors.textMuted} style={styles.offlineTitle}>
          CO DZIAŁA OFFLINE
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Lista produktów, ręczne dodawanie, ulubione przepisy i lista zakupów. Nie działa: rozpoznawanie zdjęć i
          generowanie nowych propozycji.
        </AppText>
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
  card: {
    marginTop: spacing.space6,
  },
  cardInner: {
    paddingVertical: 28,
    paddingHorizontal: 22,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space4,
  },
  title: {
    fontSize: 20,
  },
  description: {
    marginTop: spacing.space2,
    fontSize: 13.5,
    lineHeight: 20,
  },
  techBlock: {
    backgroundColor: colors.borderSubtle,
    borderRadius: radius.md,
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space3,
    marginTop: spacing.space5,
  },
  techText: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 11,
  },
  actions: {
    gap: spacing.space2,
    marginTop: spacing.space6,
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  offlineSection: {
    marginTop: spacing.space7,
  },
  offlineTitle: {
    marginBottom: spacing.space2,
  },
});
