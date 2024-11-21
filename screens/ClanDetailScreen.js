// screens/ClanDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClanDetailScreen({ route }) {
  const { clanId } = route.params;
  const [clanDetails, setClanDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClanDetails();
  }, []);

  const fetchClanDetails = async () => {
    try {
      const response = await fetch(
        `https://api.worldofwarplanes.eu/wowp/clans/info/?application_id=bd97f45a0776692f36595954cd945a29&clan_id=${clanId}`
      );
      const data = await response.json();
      setClanDetails(data.data[clanId]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00338f" />
      </View>
    );
  }

  if (!clanDetails) {
    return <Text style={styles.loading}>No clan data available</Text>;
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.clanTag}>[{clanDetails.tag}]</Text>
          <Text style={styles.clanName}>{clanDetails.name}</Text>
        </View>
        {clanDetails.old_name && (
          <Text style={styles.oldName}>
            Former name: {clanDetails.old_name} [{clanDetails.old_tag}]
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {/* Clan Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart" size={24} color="#002b80" />
            <Text style={styles.cardTitle}>Clan Status</Text>
          </View>
          <View style={styles.cardContent}>
            <InfoRow 
              label="Total Members"
              value={`${clanDetails.members_count} players`}
            />
            <InfoRow 
              label="Status"
              value={clanDetails.is_clan_disbanded ? 'Disbanded' : 'Active'}
            />
            <InfoRow 
              label="Last Updated"
              value={formatDate(clanDetails.updated_at)}
            />
          </View>
        </View>

        {/* Leadership Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={24} color="#002b80" />
            <Text style={styles.cardTitle}>Leadership</Text>
          </View>
          <View style={styles.cardContent}>
            <InfoRow 
              label="Clan Commander"
              value={clanDetails.leader_name}
            />
            <InfoRow 
              label="Clan Creator"
              value={clanDetails.creator_name}
            />
            <InfoRow 
              label="Created on"
              value={formatDate(clanDetails.created_at)}
            />
            {clanDetails.renamed_at && (
              <InfoRow 
                label="Last Renamed"
                value={formatDate(clanDetails.renamed_at)}
              />
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={24} color="#002b80" />
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <Text style={styles.description}>
            {clanDetails.description || 'No description available'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#002b80',
    padding: 20,
    paddingBottom: 25,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  clanTag: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d2af39',
    marginRight: 8,
  },
  clanName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  oldName: {
    color: '#ffffff80',
    fontSize: 14,
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002b80',
    marginLeft: 10,
  },
  cardContent: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#002b80',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    padding: 15,
  },
});