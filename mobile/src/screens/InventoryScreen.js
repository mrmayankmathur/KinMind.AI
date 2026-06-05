import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { getDB } from '../database/schema';
import { useIsFocused } from '@react-navigation/native';

export default function InventoryScreen() {
  const [stats, setStats] = useState({ xp: 0, level: 1, completed: 0 });
  const isFocused = useIsFocused(); // Refresh stats when user clicks this tab

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try { // Fails gracefully on web where SQLite might be disabled
        const db = await getDB();
        if(!db) return;
        const result = await db.getFirstAsync('SELECT * FROM UserStats WHERE id = 1');
        if (result && mounted) {
           setStats({ xp: result.xp, level: result.level, completed: result.quests_completed });
        }
      } catch(e) {}
    };
    if (isFocused) fetchStats();
    return () => { mounted = false; };
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Captain's Inventory</Text>
      
      <View style={styles.card}>
        <Text style={styles.statLabel}>Current Level</Text>
        <Text style={styles.statNumber}>🔱 {stats.level}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.statLabel}>Total Treasure (XP)</Text>
        <Text style={styles.statNumber}>💰 {stats.xp}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.statLabel}>Blockades Destroyed</Text>
        <Text style={styles.statNumber}>⚓️ {stats.completed}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: { color: colors.primary, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 60, marginBottom: 40 },
  card: { backgroundColor: colors.surface, padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: colors.secondary },
  statLabel: { color: colors.text, fontSize: 16, marginBottom: 5 },
  statNumber: { color: colors.primary, fontSize: 32, fontWeight: 'bold' }
});
