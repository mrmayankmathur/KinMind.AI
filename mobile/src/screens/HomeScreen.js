import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import colors from '../theme/colors';
import NetworkRadar from '../components/NetworkRadar';
import useAIConnection from '../hooks/useAIConnection';
import { setupDatabase, getSavedQuests } from '../database/schema';

export default function HomeScreen({ navigation }) {
  const [topic, setTopic] = useState('');
  const [history, setHistory] = useState([]);
  const connection = useAIConnection();

  useEffect(() => {
    // 1. Initialize SQLite Database on mount
    // 2. Fetch past quests to display for Tier 3 (Offline) users
    const initAndFetch = async () => {
      await setupDatabase();
      const pastQuests = await getSavedQuests();
      setHistory(pastQuests);
    };
    initAndFetch();
  }, []);

  const startVoyage = () => {
    if (topic.trim() === '') return;
    navigation.navigate('Map', { topic, isLocalInference: connection === 'local' });
  };

  const isOffline = connection === 'offline';

  return (
    <View style={styles.container}>
      <NetworkRadar />
      
      <Text style={styles.title}>The Captain's Table</Text>
      
      {/* 
        This is where the magic happens!
        If they are offline, the primary 'Generate' area grays out and changes copy.
      */}
      <View style={[styles.helmSection, isOffline && styles.offlineSection]}>
        <Text style={styles.subtitle}>
          {isOffline ? "The winds are calm. No AI Navigator found." : "Where are we sailing today, Captain?"}
        </Text>
        
        <TextInput
          style={[styles.input, isOffline && styles.inputDisabled]}
          placeholder={isOffline ? "Cannot chart new courses while offline..." : "E.g., Biology Cell Structures..."}
          placeholderTextColor="#888"
          value={topic}
          onChangeText={setTopic}
          editable={!isOffline}
        />
        
        <TouchableOpacity 
          style={[styles.button, isOffline && styles.buttonDisabled]} 
          onPress={startVoyage}
          disabled={isOffline}
        >
          <Text style={styles.buttonText}>{isOffline ? 'Sails Tied' : 'Chart Course'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* The Hub: Always available offline or online */}
      <Text style={styles.hubTitle}>The Ship's Log (Past Voyages)</Text>
      
      {history.length === 0 ? (
        <Text style={styles.emptyText}>No voyages recorded yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.historyCard} onPress={() => {
              // They can tap a past quest to reload that map from the database!
              const parsedQuest = JSON.parse(item.quest_json);
              navigation.navigate('Map', { topic: parsedQuest.topic, preLoadedQuest: parsedQuest });
            }}>
              <Text style={styles.historyTitle}>{item.river_name || item.topic}</Text>
              <Text style={styles.historyDate}>{new Date(item.date_created).toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginTop: 80, marginBottom: 20 },
  
  helmSection: { marginBottom: 20 },
  offlineSection: { opacity: 0.5 },
  
  subtitle: { fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  
  input: { backgroundColor: colors.surface, color: colors.text, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, fontSize: 16, marginBottom: 20 },
  inputDisabled: { backgroundColor: '#222', borderColor: '#444' },
  
  button: { backgroundColor: colors.primary, padding: 18, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#555' },
  buttonText: { color: colors.background, fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },

  divider: { height: 1, backgroundColor: colors.surface, marginVertical: 20 },
  
  hubTitle: { fontSize: 20, color: colors.primary, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { color: '#888', fontStyle: 'italic' },
  
  historyCard: { backgroundColor: colors.surface, padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: colors.secondary },
  historyTitle: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  historyDate: { color: '#888', fontSize: 12, marginTop: 5 }
});
