import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { AppText } from '../../components';
import { colors, spacing, screenPaddingHorizontal, fontFamily } from '../../theme';
import { useHistoryStore, HistoryEntry } from '../../store/useHistoryStore';
import { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'History'>;

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatEntryTime(timestamp: number): { text: string; isRecent: boolean } {
  const date = new Date(timestamp);
  const now = new Date();
  const time = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  if (isSameDay(date, now)) return { text: `dziś ${time}`, isRecent: true };
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return { text: `wczoraj ${time}`, isRecent: true };
  const dateStr = date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
  return { text: `${dateStr} ${time}`, isRecent: false };
}

function dotColor(entry: HistoryEntry, isRecent: boolean): string {
  if (!isRecent) return colors.line;
  switch (entry.type) {
    case 'scan':
      return colors.accent600;
    case 'generation':
      return colors.primary700;
    case 'cooked':
      return colors.secondary500;
  }
}

export function HistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const entries = useHistoryStore((s) => s.entries).filter((e) => Date.now() - e.timestamp <= THIRTY_DAYS_MS);

  const handleAction = (entry: HistoryEntry) => {
    switch (entry.type) {
      case 'scan':
        navigation.getParent()?.navigate('FridgeTab' as never);
        break;
      case 'generation':
        navigation.getParent()?.navigate('GeneratorTab' as never);
        break;
      case 'cooked':
        if (entry.recipeId !== undefined) {
          navigation
            .getParent()
            ?.navigate('RecipesTab', { screen: 'RecipeDetail', params: { recipeId: entry.recipeId, from: 'recipes' } } as never);
        }
        break;
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.space4, paddingBottom: insets.bottom + spacing.space6 }]}
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
        <ArrowLeft size={16} color={colors.mute} />
        <AppText style={styles.backLabel} color={colors.mute}>
          Więcej
        </AppText>
      </Pressable>

      <AppText variant="h1" style={styles.title}>
        Historia
      </AppText>
      <AppText variant="caption" color={colors.mute} style={styles.description}>
        Skany lodówki i wygenerowane listy z ostatnich 30 dni.
      </AppText>

      {entries.length === 0 && (
        <AppText variant="caption" color={colors.mute} style={styles.emptyText}>
          Nic tu jeszcze nie ma - historia pojawi się po pierwszym skanie lub wygenerowaniu przepisów.
        </AppText>
      )}

      <View style={styles.timeline}>
        {entries.map((entry, i) => {
          const { text, isRecent } = formatEntryTime(entry.timestamp);
          return (
            <View key={entry.id} style={styles.timelineRow}>
              <View style={styles.timelineTrack}>
                <View style={[styles.dot, { backgroundColor: dotColor(entry, isRecent) }]} />
                {i < entries.length - 1 && <View style={styles.trackLine} />}
              </View>
              <View style={styles.card}>
                <AppText variant="meta" color={colors.mute}>
                  {text}
                </AppText>
                <AppText style={styles.cardTitle}>{entry.title}</AppText>
                <AppText variant="caption" color={colors.mute} style={styles.cardDescription}>
                  {entry.description}
                </AppText>
                <Pressable onPress={() => handleAction(entry)} hitSlop={8}>
                  <AppText style={styles.actionLink} color={colors.primary700}>
                    {entry.actionLabel}
                  </AppText>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
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
  description: {
    marginTop: spacing.space2,
  },
  emptyText: {
    marginTop: spacing.space6,
    lineHeight: 18,
  },
  timeline: {
    marginTop: spacing.space6,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.space3,
  },
  timelineTrack: {
    width: 9,
    alignItems: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 6,
  },
  trackLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.line,
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 13,
    marginBottom: spacing.space3,
  },
  cardTitle: {
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: 14.5,
    color: colors.ink,
    marginTop: 4,
  },
  cardDescription: {
    marginTop: 4,
    lineHeight: 18,
  },
  actionLink: {
    fontFamily: fontFamily.outfitMedium,
    fontSize: 12.5,
    marginTop: spacing.space2,
  },
});
