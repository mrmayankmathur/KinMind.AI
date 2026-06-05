import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

export default function ArmoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>The Armory</Text>
      
      <Text style={styles.subtitle}>Equip your ship for the upcoming voyages.</Text>
      
      <TouchableOpacity style={styles.upgradeBtn}>
         <Text style={styles.btnIcon}>💣</Text>
         <View style={styles.btnTextContainer}>
            <Text style={styles.btnTitle}>Iron Cannonballs (LVL 2)</Text>
            <Text style={styles.btnDesc}>Deal extra damage to Challenge Blockades.</Text>
         </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.upgradeBtn}>
         <Text style={styles.btnIcon}>🔭</Text>
         <View style={styles.btnTextContainer}>
            <Text style={styles.btnTitle}>Golden Spyglass</Text>
            <Text style={styles.btnDesc}>Allows vision-AI decoding on puzzles.</Text>
         </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: { color: colors.primary, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 60, marginBottom: 10 },
  subtitle: { color: colors.text, fontSize: 14, textAlign: 'center', marginBottom: 40, fontStyle: 'italic' },
  upgradeBtn: { flexDirection: 'row', backgroundColor: colors.surface, padding: 15, borderRadius: 12, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#555' },
  btnIcon: { fontSize: 40, marginRight: 15 },
  btnTextContainer: { flex: 1 },
  btnTitle: { color: colors.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  btnDesc: { color: colors.text, fontSize: 12 }
});
