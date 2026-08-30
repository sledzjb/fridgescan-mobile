import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TriangleAlert } from 'lucide-react-native';
import { AppText, Button, Card } from '../../components';
import { colors, radius, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { ScanStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanNoResults'>;

const TIPS = [
  'Otwórz drzwi szerzej i włącz światło w pomieszczeniu',
  'Wyciągnij produkty z szuflad na widoczną półkę',
  'Trzymaj telefon 40–60 cm od lodówki, bez zbliżenia',
];

export function ScanNoResultsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const openAddProductInFridge = () => {
    navigation
      .getParent()
      ?.navigate('MainTabs', { screen: 'FridgeTab', params: { screen: 'AddProduct' } } as never);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.space4 }]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <ArrowLeft size={16} color={colors.mute} />
        <AppText style={styles.backLabel} color={colors.mute}>
          Skanuj ponownie
        </AppText>
      </Pressable>

      <Card style={styles.card} radius={20} padding={0}>
        <View style={styles.cardInner}>
          <View style={styles.iconTile}>
            <TriangleAlert size={24} color={colors.secondary700} />
          </View>
          <AppText variant="h3" style={styles.title}>
            Nie rozpoznaliśmy żadnego produktu
          </AppText>
          <AppText variant="caption" color={colors.mute} style={styles.description}>
            Zdjęcie było zbyt ciemne albo produkty są zasłonięte. To zdarza się przy zamkniętych szufladach i folii.
          </AppText>

          <View style={styles.tips}>
            {TIPS.map((tip, i) => (
              <View key={tip} style={styles.tipRow}>
                <AppText style={styles.tipNumber} color={colors.primary700}>
                  {String(i + 1).padStart(2, '0')}
                </AppText>
                <AppText variant="body" color={colors.inkSoft} style={styles.tipText}>
                  {tip}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button label="Zrób nowe zdjęcie" variant="accentAction" onPress={() => navigation.goBack()} style={styles.fullWidth} />
        <Button label="Wpisz produkty ręcznie" variant="outline" onPress={openAddProductInFridge} style={styles.fullWidth} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.secondary50,
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
  tips: {
    marginTop: spacing.space5,
    gap: spacing.space3,
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.space3,
  },
  tipNumber: {
    fontFamily: fontFamily.plexMonoRegular,
    fontSize: 11,
    width: 18,
  },
  tipText: {
    flex: 1,
  },
  actions: {
    gap: spacing.space3,
    marginTop: spacing.space6,
  },
  fullWidth: {
    width: '100%',
  },
});
