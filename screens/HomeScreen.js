// screens/HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const features = [
    {
      title: 'Warplanes',
      description: 'Explore detailed information about various military aircraft',
      icon: 'airplane',
      route: 'Warplanes'
    },
    {
      title: 'Player Profiles',
      description: 'Search and view player statistics',
      icon: 'person',
      route: 'Players'
    },
    {
      title: 'Clans',
      description: 'Discover and join powerful aviation clans',
      icon: 'people',
      route: 'Clans'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placeholder.com/wowp-logo' }}
          style={styles.logo}
        />
        <Text style={styles.title}>World of Warplanes</Text>
        <Text style={styles.subtitle}>
          Experience epic aerial combat in this action-packed MMO game
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => navigation.navigate(feature.route)}
          >
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#002b80',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  featuresContainer: {
    padding: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: '#00338f',
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002b80',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
  },
});