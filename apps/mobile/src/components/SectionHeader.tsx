import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, type } from '@/theme/tokens';

export function SectionHeader({ title, action }: { title: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.row}>
      <Text style={type.heading}>{title}</Text>
      {action ? (
        <Pressable accessibilityRole="button" hitSlop={10} onPress={action.onPress}>
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  action: { color: colors.green, fontWeight: '800', fontSize: 14 },
});
