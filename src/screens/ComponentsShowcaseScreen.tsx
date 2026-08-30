import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import {
  AppText,
  Button,
  Chip,
  Badge,
  Input,
  Toggle,
  Checkbox,
  Stepper,
  ListRow,
  Card,
  BottomSheet,
  Toast,
  useToast,
} from '../components';
import { colors, spacing, screenPaddingHorizontal } from '../theme';

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

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

export function ComponentsShowcaseScreen() {
  const [toggleOn, setToggleOn] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);
  const [checkedA, setCheckedA] = useState(true);
  const [checkedB, setCheckedB] = useState(false);
  const [qtySzt, setQtySzt] = useState(6);
  const [qtyG, setQtyG] = useState(200);
  const [qtyL, setQtyL] = useState(1);
  const [name, setName] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const toast = useToast();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppText variant="h1">Komponenty bazowe</AppText>
      <AppText variant="bodyL" color={colors.mute} style={styles.subtitle}>
        FridgeScan · theme.ts + biblioteka komponentów, krok 2 z rekomendowanej kolejności implementacji.
      </AppText>

      <Section title="BUTTON">
        <Button label="Zapisz do lodówki" variant="primary" onPress={() => {}} style={styles.fullWidth} />
        <View style={styles.gapSm} />
        <Button label="Generuj przepisy" variant="secondary" onPress={() => {}} style={styles.fullWidth} />
        <View style={styles.gapSm} />
        <Button label="Oznacz jako wykonane" variant="accentAction" onPress={() => {}} style={styles.fullWidth} />
        <View style={styles.gapSm} />
        <Button label="Dodam produkty ręcznie" variant="outline" onPress={() => {}} style={styles.fullWidth} />
        <View style={styles.gapSm} />
        <Button label="Pomiń" variant="tertiary" onPress={() => {}} />
        <View style={styles.gapSm} />
        <Button label="Dodaj do lodówki" variant="primary" disabled onPress={() => {}} style={styles.fullWidth} />
        <View style={styles.gapSm} />
        <Button
          label="Zrób zdjęcie"
          variant="primary"
          onPress={() => {}}
          icon={<Camera size={18} color={colors.white} />}
          style={styles.fullWidth}
        />
        <View style={styles.darkSwatch}>
          <Button label="Otwórz ustawienia systemowe" variant="primary" inverted onPress={() => {}} style={styles.fullWidth} />
          <View style={styles.gapSm} />
          <Button label="Dodaj produkty ręcznie" variant="outline" inverted onPress={() => {}} style={styles.fullWidth} />
        </View>
      </Section>

      <Section title="CHIP">
        <Row>
          <Chip label="Nabiał" state="default" onPress={() => {}} />
          <Chip label="Warzywa" state="selected" onPress={() => {}} />
          <Chip label="Wszystkie" state="filterActive" onPress={() => {}} />
          <Chip label="Ziemniaki" state="suggestion" onPress={() => {}} />
        </Row>
      </Section>

      <Section title="BADGE">
        <Row>
          <Badge label="92% dopasowania" variant="match" />
          <Badge label="został 1 dzień" variant="expiry" />
        </Row>
        <View style={styles.darkSwatch}>
          <Row>
            <Badge label="jajka · 96%" variant="recognized" />
            <Badge label="szpinak? · 64%" variant="uncertain" />
          </Row>
        </View>
      </Section>

      <Section title="INPUT">
        <View style={styles.gap}>
          <Input placeholder="Twoje imię" value={name} onChangeText={setName} />
          <Input placeholder="np. Pomidory" defaultValue="Feta" />
          <Input placeholder="Imię" defaultValue="Ala" variant="onCard" />
          <Input defaultValue="150" variant="numeric" keyboardType="numeric" />
        </View>
      </Section>

      <Section title="TOGGLE / CHECKBOX">
        <Row>
          <Toggle value={toggleOn} onValueChange={setToggleOn} />
          <Toggle value={toggleOff} onValueChange={setToggleOff} />
          <Checkbox value={checkedA} onValueChange={setCheckedA} />
          <Checkbox value={checkedB} onValueChange={setCheckedB} />
        </Row>
      </Section>

      <Section title="STEPPER ILOŚCI">
        <View style={styles.gap}>
          <Stepper value={qtySzt} unit="szt" onChange={setQtySzt} />
          <Stepper value={qtyG} unit="g" onChange={setQtyG} />
          <Stepper value={qtyL} unit="l" onChange={setQtyL} />
        </View>
      </Section>

      <Section title="LISTROW / CARD">
        <Card>
          <ListRow title="Jajka" meta="Nabiał" value="6 szt" thumbnailFallbackLetter="J" chevron />
          <ListRow title="Szpinak" meta="Warzywa" value="200 g" thumbnailFallbackLetter="S" chevron />
          <ListRow title="+ Dodaj produkt ręcznie" onPress={() => {}} last />
        </Card>
      </Section>

      <Section title="BOTTOM SHEET / TOAST">
        <Row>
          <Button label="Otwórz arkusz edycji" variant="secondary" onPress={() => setSheetOpen(true)} />
        </Row>
        <Row>
          <Button
            label="Pokaż toast"
            variant="outline"
            onPress={() => toast.show('Dodano »Pomidory« do lodówki')}
          />
        </Row>
      </Section>

      <View style={{ height: spacing.space9 }} />

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <AppText variant="h3">Edytuj produkt</AppText>
        <View style={{ height: spacing.space4 }} />
        <Input placeholder="Nazwa" defaultValue="Feta" />
        <View style={{ height: spacing.space4 }} />
        <Row>
          <Button label="Usuń" variant="outline" onPress={() => setSheetOpen(false)} />
          <View style={{ flex: 1 }}>
            <Button label="Zapisz" variant="primary" onPress={() => setSheetOpen(false)} />
          </View>
        </Row>
      </BottomSheet>

      <Toast
        visible={toast.visible}
        message={toast.message}
        actionLabel="Cofnij"
        onActionPress={toast.hide}
        onHide={toast.hide}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingTop: 64,
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 24,
  },
  subtitle: {
    marginTop: spacing.space2,
    marginBottom: spacing.space6,
  },
  section: {
    marginBottom: spacing.space7,
  },
  sectionTitle: {
    marginBottom: spacing.space3,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space3,
    marginBottom: spacing.space3,
    alignItems: 'center',
  },
  gap: {
    gap: spacing.space3,
  },
  gapSm: {
    height: spacing.space3,
  },
  fullWidth: {
    width: '100%',
  },
  darkSwatch: {
    backgroundColor: colors.accent900,
    borderRadius: 16,
    padding: spacing.space4,
    marginTop: spacing.space2,
  },
});
