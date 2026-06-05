import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import TileComponent from "../components/TileComponent";
import Ship from "../components/Ship";
import colors from "../theme/colors";
import { saveQuestLocally } from "../database/schema";

const generateLocalQuestMock = (topic) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        river_name: `The Sea of ${topic}`,
        topic: topic,
        total_nodes: 4,
        waypoints: [
          { id: 1, type: "learning_island", title: `Intro to ${topic}`, brief: `Local Gemma: Learn the basics of ${topic}.` },
          { id: 2, type: "challenge_blockade", title: "First Assessment", brief: "Local Gemma: A quick quiz to check your understanding." },
          { id: 3, type: "learning_island", title: `Mastery`, brief: `Local Gemma: Deep dive into complex topics.` },
          { id: 4, type: "boss_blockade", title: `Final Exam`, brief: `Local Gemma: Prove your overall mastery.` },
        ],
      });
    }, 1500);
  });
};

export default function MapScreen({ route, navigation }) {
  const params = route?.params || {};
  const topic = params.topic || "Demo Topic";
  const preLoadedQuest = params.preLoadedQuest || null;
  const isLocalInference = params.isLocalInference || false;

  const [quest, setQuest] = useState(preLoadedQuest);
  const [loading, setLoading] = useState(!preLoadedQuest);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Game State: Tracks how high up the river the user is!
  const [completedNodes, setCompletedNodes] = useState(0);

  useEffect(() => {
    if (!preLoadedQuest) {
      fetchQuest();
    }
  }, [topic, preLoadedQuest]);

  const fetchQuest = async () => {
    try {
      let data;
      if (isLocalInference) {
        data = await generateLocalQuestMock(topic);
      } else {
        const response = await fetch("http://192.168.1.5:8000/quest/generate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, age_group: 16, difficulty: "medium" }),
        });
        if (!response.ok) throw new Error("Edge failed");
        data = await response.json();
      }
      try { await saveQuestLocally(data); } catch (sqError) {}
      setQuest(data);
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleNodeVictory = (nodeId) => {
     // When the ChallengeScreen says they won, we increment progression!
     if (nodeId > completedNodes) {
        setCompletedNodes(nodeId);
     }
  };

  if (errorMsg) return <View style={styles.loadingContainer}><Text style={{ color: "red" }}>ERROR: {errorMsg}</Text></View>;
  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.loadingText}>The Grand Navigator is charting...</Text></View>;

  // Mathematics of the Boat:
  // Each tile is 250 height. We offset the boat by completedNodes * 250 so it physically moves UP the screen!
  const BASE_Y = 120;
  const currentYOffset = BASE_Y + (completedNodes * 250);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{quest?.river_name || "Uncharted Waters"}</Text>
      
      {/* Ship is wrapped in a container that moves up dynamically! */}
      <View style={[StyleSheet.absoluteFillObject, { bottom: currentYOffset, zIndex: 100 }]} pointerEvents="none">
         <Ship />
      </View>

      <FlatList
        data={quest?.waypoints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TileComponent 
             waypoint={item} 
             index={index} 
             isCompleted={item.id <= completedNodes}
             onNodePress={(wp) => navigation.navigate('Challenge', { 
               waypoint: wp, 
               isLocalInference,
               onVictory: () => handleNodeVictory(wp.id) // Pass callback!
             })} 
          />
        )}
        inverted={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  loadingText: { color: colors.primary, marginTop: 20, fontSize: 16 },
  header: { color: colors.text, fontSize: 24, fontWeight: "800", textAlign: "center", marginTop: 60, marginBottom: 20, textTransform: "uppercase", letterSpacing: 2 },
  listContent: { paddingBottom: 40 },
});
