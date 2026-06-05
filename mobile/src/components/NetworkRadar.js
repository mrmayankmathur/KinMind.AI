import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import useAIConnection from '../hooks/useAIConnection';

export default function NetworkRadar() {
  const connection = useAIConnection();

  const getStatusProps = () => {
    switch (connection) {
      case 'edge':
        return { icon: '🔵', text: 'Lighthouse Active', color: '#4aaae0' };
      case 'local':
        return { icon: '🟡', text: 'Compass Active', color: '#e8b851' };
      case 'offline':
        return { icon: '📜', text: 'Sailing Blind (Hub Only)', color: '#888' };
      default:
        return { icon: '❓', text: 'Scanning Horizon...', color: '#666' };
    }
  };

  const status = getStatusProps();

  return (
    <View style={[styles.container, { borderColor: status.color }]}>
      <Text style={styles.icon}>{status.icon}</Text>
      <Text style={[styles.text, { color: status.color }]}>{status.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: colors.surface,
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    elevation: 8,
    boxShadow: "0px 2px 3px rgba(0,0,0,0.5)",
    
    
    
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});
