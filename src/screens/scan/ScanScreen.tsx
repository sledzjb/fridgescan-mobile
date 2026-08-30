import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Animated, Easing, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, Image as ImageIcon, Plus } from 'lucide-react-native';
import { AppText, Button, Badge } from '../../components';
import { colors, alpha, spacing, radius } from '../../theme';
import { mockRecognizeFridgePhoto, RecognitionOutcome } from '../../services/mockRecognition';
import { ScanStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScanStackParamList, 'Scan'>;

const SCAN_LINE_HEIGHT = 260;

export function ScanScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [visibleBadges, setVisibleBadges] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  useEffect(() => {
    if (!busy) {
      setVisibleBadges(0);
      return;
    }
    const t1 = setTimeout(() => setVisibleBadges(1), 500);
    const t2 = setTimeout(() => setVisibleBadges(2), 1000);
    scanLineAnim.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      loop.stop();
    };
  }, [busy, scanLineAnim]);

  const closeModal = () => navigation.getParent()?.goBack();

  const openAddProductInFridge = () => {
    navigation
      .getParent()
      ?.navigate('MainTabs', { screen: 'FridgeTab', params: { screen: 'AddProduct' } } as never);
  };

  const handleOutcome = (outcome: RecognitionOutcome) => {
    setBusy(false);
    if (outcome.type === 'success') {
      navigation.getParent()?.navigate(
        'MainTabs',
        { screen: 'FridgeTab', params: { screen: 'RecognizedProducts', params: { items: outcome.items } } } as never
      );
    } else if (outcome.type === 'empty') {
      navigation.navigate('ScanNoResults');
    } else {
      navigation.navigate('ScanError');
    }
  };

  const runScan = async () => {
    if (busy) return;
    setBusy(true);
    const outcome = await mockRecognizeFridgePhoto();
    handleOutcome(outcome);
  };

  const handleShutter = async () => {
    if (busy) return;
    try {
      await cameraRef.current?.takePictureAsync({ quality: 0.5 });
    } catch {
      // Rozpoznawanie jest zamockowane - nieudane realne ujęcie nie blokuje przepływu.
    }
    runScan();
  };

  const handleGallery = async () => {
    if (busy) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
    if (result.canceled) return;
    runScan();
  };

  if (!permission) {
    return <View style={styles.screen} />;
  }

  if (!permission.granted) {
    return (
      <CameraPermissionDeniedContent
        insets={insets}
        onOpenSettings={() => Linking.openSettings()}
        onManualAdd={openAddProductInFridge}
        onBack={closeModal}
      />
    );
  }

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_LINE_HEIGHT],
  });

  return (
    <View style={styles.screen}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      <View style={[styles.topBar, { top: insets.top + 20 }]}>
        <Pressable onPress={closeModal} style={styles.backCircle} hitSlop={8}>
          <ArrowLeft size={18} color={colors.white} />
        </Pressable>
        <AppText variant="kicker" color={alpha.whiteText60}>
          SKAN LODÓWKI
        </AppText>
      </View>

      {busy && (
        <View style={styles.scanArea} pointerEvents="none">
          <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineTranslateY }] }]} />
          {visibleBadges >= 1 && (
            <View style={[styles.badgeSlot, { top: 60, left: 24 }]}>
              <Badge label="jajka · 96%" variant="recognized" />
            </View>
          )}
          {visibleBadges >= 2 && (
            <View style={[styles.badgeSlot, { top: 150, right: 32 }]}>
              <Badge label="szpinak? · 64%" variant="uncertain" />
            </View>
          )}
        </View>
      )}

      <View style={[styles.bottomArea, { bottom: insets.bottom + 50 }]}>
        <AppText style={styles.bottomText} color={alpha.whiteText72}>
          {busy ? 'Rozpoznaję produkty…' : 'Zrób zdjęcie lodówki, wybierz je z galerii albo dodaj produkty ręcznie'}
        </AppText>

        <View style={[styles.controlsRow, busy && styles.controlsRowDisabled]} pointerEvents={busy ? 'none' : 'auto'}>
          <Pressable style={styles.smallControl} onPress={handleGallery}>
            <ImageIcon size={20} color={colors.white} />
          </Pressable>
          <Pressable style={styles.shutterRing} onPress={handleShutter}>
            <View style={styles.shutterInner} />
          </Pressable>
          <Pressable style={styles.smallControl} onPress={openAddProductInFridge}>
            <Plus size={20} color={colors.white} />
          </Pressable>
        </View>
        <AppText style={styles.controlsCaption} color={alpha.whiteText50}>
          galeria · zdjęcie · ręcznie
        </AppText>
      </View>
    </View>
  );
}

function CameraPermissionDeniedContent({
  insets,
  onOpenSettings,
  onManualAdd,
  onBack,
}: {
  insets: EdgeInsets;
  onOpenSettings: () => void;
  onManualAdd: () => void;
  onBack: () => void;
}) {
  return (
    <View style={[styles.deniedScreen, { paddingTop: insets.top + spacing.space6, paddingBottom: insets.bottom + spacing.space5 }]}>
      <View style={styles.deniedContent}>
        <View style={styles.deniedTile}>
          <Camera size={28} color={colors.white} />
        </View>
        <AppText variant="h1" color={colors.white}>
          Aplikacja nie ma dostępu do kamery
        </AppText>
        <AppText variant="bodyL" color={alpha.whiteText72} style={styles.deniedDescription}>
          Bez kamery nie zrobimy zdjęcia lodówki. Możesz włączyć dostęp w ustawieniach systemowych albo pracować bez
          skanowania.
        </AppText>

        <View style={styles.deniedCard}>
          <AppText variant="kicker" color={alpha.whiteText60}>
            CO ROBIMY ZE ZDJĘCIEM
          </AppText>
          <AppText variant="body" color={alpha.whiteText72} style={styles.deniedCardText}>
            Wysyłamy je raz do rozpoznania i usuwamy po 24 godzinach. Nie zapisujemy go w galerii aplikacji.
          </AppText>
        </View>
      </View>

      <View style={styles.deniedActions}>
        <Button label="Otwórz ustawienia systemowe" variant="primary" inverted onPress={onOpenSettings} style={styles.fullWidth} />
        <Button label="Dodaj produkty ręcznie" variant="outline" inverted onPress={onManualAdd} style={styles.fullWidth} />
        <Button label="Wróć do lodówki" variant="tertiary" textColor={alpha.whiteText60} onPress={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.accent900,
  },
  topBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
  },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: alpha.whiteTile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: SCAN_LINE_HEIGHT,
  },
  scanLine: {
    height: 2,
    backgroundColor: colors.accent400,
    marginHorizontal: 20,
  },
  badgeSlot: {
    position: 'absolute',
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 250,
    marginBottom: spacing.space6,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 26,
  },
  controlsRowDisabled: {
    opacity: 0.4,
  },
  smallControl: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: alpha.whiteTile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRing: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  controlsCaption: {
    fontSize: 11.5,
    marginTop: spacing.space3,
  },
  deniedScreen: {
    flex: 1,
    backgroundColor: colors.accent900,
    paddingHorizontal: 26,
    justifyContent: 'space-between',
  },
  deniedContent: {
    flex: 1,
    justifyContent: 'center',
  },
  deniedTile: {
    width: 62,
    height: 62,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space5,
  },
  deniedDescription: {
    marginTop: spacing.space3,
  },
  deniedCard: {
    backgroundColor: 'rgba(255,255,255,.08)',
    borderRadius: radius.lg,
    padding: spacing.space4,
    marginTop: spacing.space6,
  },
  deniedCardText: {
    marginTop: spacing.space2,
  },
  deniedActions: {
    gap: spacing.space2,
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});
