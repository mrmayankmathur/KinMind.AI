import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import TileComponent from "../components/TileComponent";
import Ship from "../components/Ship";
import colors from "../theme/colors";
import { saveQuestLocally } from "../database/schema";

// Mock generation for the on-device Gemma4 simulation
const generateLocalQuestMock = (topic) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        river_name: `The Sea of ${topic}`,
        topic: topic,
        total_nodes: 4,
        waypoints: [
          {
            id: 1,
            type: "learning_island",
            title: `Intro to ${topic}`,
            brief: `Local Gemma: Learn the basics of ${topic}.`,
          },
          {
            id: 2,
            type: "challenge_blockade",
            title: "First Assessment",
            brief: "Local Gemma: A quick quiz to check your understanding.",
          },
        ],
      });
    }, 1500);
  });
};

export default function MapScreen({ route, navigation }) {
  // FIXED SYNTAX ISSUE HERE
  const params = route?.params || {};
  const topic = params.topic || "Demo Topic";
  const preLoadedQuest = params.preLoadedQuest || null;
  const isLocalInference = params.isLocalInference || false;

  const [quest, setQuest] = useState(preLoadedQuest);
  const [loading, setLoading] = useState(!preLoadedQuest);
  const [errorMsg, setErrorMsg] = useState("");

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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: topic,
            age_group: 16,
            difficulty: "medium",
          }),
        });

        if (!response.ok) throw new Error("Edge failed");
        data = await response.json();
      }

      try {
        await saveQuestLocally(data);
      } catch (sqError) {
        console.warn(
          "SQLite failed to save, but map will still display:",
          sqError,
        );
      }

      setQuest(data);
    } catch (error) {
      console.error("Map Generation Fatal Error:", error);
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>ERROR: {errorMsg}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          {isLocalInference
            ? "The Ship's Compass is charting..."
            : "The Grand Navigator is charting..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {quest?.river_name || "Uncharted Waters"}
      </Text>

      <Ship currentYOffset={120} />
      <FlatList
        data={quest?.waypoints}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={({ item, index }) => (
          <TileComponent waypoint={item} index={index} onNodePress={(wp) => navigation.navigate('Challenge', { waypoint: wp, isLocalInference })} />
        )}
        inverted={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: { color: colors.primary, marginTop: 20, fontSize: 16 },
  header: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  listContent: { paddingBottom: 40 },
});
