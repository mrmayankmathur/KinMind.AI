import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import colors from '../theme/colors';
import { addXP } from '../database/schema';

export default function ChallengeScreen({ route, navigation }) {
  const { waypoint, isLocalInference, onVictory } = route.params;

  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  const isBlockade = waypoint.type.includes('blockade');
  const nodeIcon = isBlockade ? '⚔️' : '📜';
  const nodeColor = isBlockade ? colors.error : colors.primary;

  const checkKnowledge = async () => {
    if (answer.trim() === '') return;
    setEvaluating(true);

    setTimeout(async () => {
       setEvaluating(false);
       
       const xpReward = isBlockade ? 50 : 15;
       await addXP(xpReward);
       
       Alert.alert("Success!", `You proved your knowledge and earned ${xpReward} XP!`, [
         { text: "Return to Ship", onPress: () => {
             // 1. Tell the MapScreen that we beat this node
             if (onVictory) onVictory(); 
             // 2. Head back to the river
             navigation.goBack(); 
         }}
       ]);

    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerCard, { borderColor: nodeColor }]}>
        <Text style={styles.nodeIcon}>{nodeIcon}</Text>
        <Text style={[styles.title, { color: nodeColor }]}>{waypoint.title}</Text>
        <Text style={styles.topicText}>Topic: {waypoint.brief}</Text>
      </View>

      <View style={styles.contentArea}>
         <Text style={styles.questionPrompt}>
           {isBlockade 
             ? "To pass this blockade, tell the AI exactly how this process works in 2 sentences."
             : "Read the captain's logs carefully. What is your understanding of this topic?"}
         </Text>

         <TextInput
            style={styles.input}
            multiline
            numberOfLines={5}
            placeholder="Type your response here or use the Ship's Wheel to speak..."
            placeholderTextColor="#888"
            value={answer}
            onChangeText={setAnswer}
         />

         {evaluating ? (
             <View style={{alignItems: 'center', marginTop: 20}}>
                 <ActivityIndicator size="large" color={colors.primary} />
                 <Text style={{color: colors.primary, marginTop: 10}}>The Grand Navigator is evaluating your answer...</Text>
             </View>
         ) : (
             <TouchableOpacity style={[styles.submitBtn, { backgroundColor: nodeColor }]} onPress={checkKnowledge}>
               <Text style={styles.submitBtnText}>{isBlockade ? "Attack Blockade" : "Submit Notes"}</Text>
             </TouchableOpacity>
         )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  headerCard: {
    backgroundColor: colors.surface, padding: 20, borderRadius: 16, borderWidth: 2,
    alignItems: 'center', marginTop: 30, marginBottom: 30,
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  nodeIcon: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', marginBottom: 5 },
  topicText: { color: colors.text, fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
  
  contentArea: { flex: 1 },
  questionPrompt: { color: colors.text, fontSize: 16, lineHeight: 24, marginBottom: 20, textAlign: 'center' },
  
  input: {
    backgroundColor: '#1b2030', color: colors.text, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.primary,
    fontSize: 16, height: 150, textAlignVertical: 'top'
  },
  
  submitBtn: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 5 },
  submitBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' }
});
