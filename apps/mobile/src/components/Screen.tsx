import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space, type } from '@/theme/tokens';

interface ScreenProps {
  children: ReactNode;
  title?: string;
  /** Show a back chevron (defaults to true when a title is set). */
  back?: boolean;
  /** Sticky bottom area for primary CTAs. */
  footer?: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Safe-area edges to pad. Tab screens pass ['top']: the tab bar owns the bottom inset. */
  edges?: ('top' | 'bottom')[];
}

export function Screen({ children, title, back, footer, onRefresh, refreshing = false, edges = ['top', 'bottom'] }: ScreenProps) {
  const showBack = back ?? Boolean(title);
  return (
    <SafeAreaView style={styles.safe} edges={[...edges, 'left', 'right']}>
      {(title || showBack) && (
        <View style={styles.header}>
          {showBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              style={styles.back}
            >
              <Ionicons name="chevron-back" size={26} color={colors.text} />
            </Pressable>
          ) : (
            <View style={styles.back} />
          )}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.back} />
        </View>
      )}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} /> : undefined
          }
        >
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, paddingVertical: space.sm },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { ...type.heading, flex: 1, textAlign: 'center', fontSize: 17 },
  content: { paddingHorizontal: space.xl - 4, paddingTop: space.sm, paddingBottom: space.xxl, gap: space.lg },
  footer: {
    paddingHorizontal: space.xl - 4,
    paddingTop: space.md,
    paddingBottom: space.lg,
    gap: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
