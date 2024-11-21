// screens/AboutScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/profile-photo.jpg')} // Make sure to add your photo to assets
          style={styles.profileImage}
        />
        
        <View style={styles.personalInfo}>
          <Text style={styles.name}>Rahadian Arif Wicaksana</Text>
          <Text style={styles.nim}>NIM: 21120122130053</Text>
          <Text style={styles.major}>Computer Engineering</Text>
        </View>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>About the App</Text>
        <Text style={styles.description}>
          World of Warplanes Companion is your ultimate guide to the aerial combat MMO game.
          This app provides detailed information about warplanes, player statistics, and clan details.
          Built with React Native, it offers a seamless experience for both iOS and Android users.
        </Text>

        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureList}>
          <FeatureItem title="Warplanes Database" />
          <FeatureItem title="Player Statistics" />
          <FeatureItem title="Clan Information" />
          <FeatureItem title="Search Functionality" />
        </View>
      </View>
    </ScrollView>
  );
}

const FeatureItem = ({ title }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureText}>• {title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    backgroundColor: '#002b80',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#d2af39',
  },
  personalInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  nim: {
    fontSize: 18,
    color: '#d2af39',
    marginBottom: 5,
  },
  major: {
    fontSize: 16,
    color: '#fff',
  },
  descriptionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002b80',
    marginBottom: 10,
    marginTop: 15,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  featureList: {
    marginTop: 10,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});