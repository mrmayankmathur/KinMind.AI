import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

export default function TileComponent({ waypoint, index, onNodePress, isCompleted }) {
  const isLeftCurve = index % 2 === 0;

  const getIslandColor = () => {
    if (isCompleted) return colors.success; // Green if beaten!
    switch (waypoint.type) {
      case 'learning_island': return colors.primary;
      case 'challenge_blockade': return colors.error;
      case 'boss_blockade': return '#8a3a99';
      default: return colors.surface;
    }
  };

  const riverPath = isLeftCurve 
    ? `M ${width/2 + 20} 260 C ${width/2 - 120} 180, ${width/2 - 120} 70, ${width/2 + 20} -10` 
    : `M ${width/2 - 20} 260 C ${width/2 + 120} 180, ${width/2 + 120} 70, ${width/2 - 20} -10`;

  return (
    <View style={styles.tileContainer}>
      <Svg height="260" width={width} style={styles.svgBackground}>
        <Path d={riverPath} fill="none" stroke="#2d4052" strokeWidth="90" />
        <Path d={riverPath} fill="none" stroke={colors.secondary} strokeWidth="80" />
      </Svg>

      <TouchableOpacity 
        style={[
          styles.islandCore, 
          { 
            borderColor: getIslandColor(), 
            alignSelf: 'center',
            marginLeft: isLeftCurve ? -140 : 140,
            opacity: isCompleted ? 0.6 : 1, // Dim if finished
          }
        ]}
        onPress={() => onNodePress(waypoint)}
      >
        <Text style={styles.title}>
          {isCompleted ? '✅ ' : ''}{waypoint.title}
        </Text>
        <Text style={styles.brief}>{waypoint.brief}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tileContainer: { height: 250, width: '100%', justifyContent: 'center' },
  svgBackground: { position: 'absolute', top: -5 },
  islandCore: {
    backgroundColor: colors.surface, padding: 15, borderRadius: 20, borderWidth: 4, width: 180,
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 5, zIndex: 10,
  },
  title: { color: colors.primary, fontSize: 13, fontWeight: '900', marginBottom: 5, textTransform: 'uppercase' },
  brief: { color: colors.text, fontSize: 11 }
});
