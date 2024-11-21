import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlayerDetailScreen({ route }) {
  const { playerId } = route.params;
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchAllPlayerData();
  }, []);

  const fetchAllPlayerData = async () => {
    try {
      const response = await fetch(
        `https://api.worldofwarplanes.eu/wowp/account/info2/?application_id=bd97f45a0776692f36595954cd945a29&account_id=${playerId}`
      );
      const data = await response.json();
      setPlayerData(data.data[playerId]);
    } catch (error) {
      setError('Error fetching player data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0 || new Date(timestamp * 1000).getFullYear() <= 1970) {
      return 'N/A';
    }
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatNumber = (num, decimals = 0) => {
    if (!num && num !== 0) return 'N/A';
    return Number(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00338f" />
    </View>
  );

  if (error) return <Text style={styles.errorText}>{error}</Text>;
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['overview', 'combat'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selectedTab === tab && styles.activeTab]}
          onPress={() => setSelectedTab(tab)}
        >
          <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverviewTab = () => (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={24} color="#002b80" />
          <Text style={styles.cardTitle}>Player Information</Text>
        </View>
        <View style={styles.cardContent}>
          <InfoRow label="Nickname" value={playerData.nickname} />
          <InfoRow label="Account Created" value={formatDate(playerData.created_at)} />
          <InfoRow label="Last Battle" value={formatDate(playerData.last_battle_time)} />
          <InfoRow label="Global Rating" value={formatNumber(playerData.global_rating)} />
          <InfoRow label="CBT Battles" value={formatNumber(playerData.cbt_games_played)} />
          <InfoRow label="OBT Battles" value={formatNumber(playerData.obt_games_played)} />
          {playerData.private?.is_premium && (
            <InfoRow 
              label="Premium Until" 
              value={formatDate(playerData.private?.premium_expires_at)} 
            />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="stats-chart" size={24} color="#002b80" />
          <Text style={styles.cardTitle}>Battle Overview</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatBox
            label="Total Battles"
            value={formatNumber(playerData.statistics?.all?.battles)}
            icon="airplane"
          />
          <StatBox
            label="Win Rate"
            value={`${formatNumber((playerData.statistics?.all?.wins / (playerData.statistics?.all?.battles || 1)) * 100, 1)}%`}
            icon="trophy"
          />
          <StatBox
            label="Avg Score"
            value={formatNumber(playerData.statistics?.all?.avg_battle_score, 0)}
            icon="stats-chart"
          />
          <StatBox
            label="Flight Time"
            value={`${formatNumber(playerData.statistics?.all?.flight_time / 3600, 0)}h`}
            icon="time"
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="ribbon" size={24} color="#002b80" />
          <Text style={styles.cardTitle}>Experience & Resources</Text>
        </View>
        <View style={styles.cardContent}>
          <InfoRow label="Average XP" value={formatNumber(playerData.statistics?.all?.avg_xp)} />
          <InfoRow label="Combat Points" value={formatNumber(playerData.statistics?.all?.battle_score)} />
          <InfoRow label="Free XP" value={formatNumber(playerData.private?.free_xp)} />
          <InfoRow label="Credits" value={formatNumber(playerData.private?.credits)} />
          <InfoRow label="Gold" value={formatNumber(playerData.private?.gold)} />
        </View>
      </View>
    </>
  );

  const renderCombatTab = () => (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="analytics" size={24} color="#002b80" />
          <Text style={styles.cardTitle}>Battle Performance</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.detailsGrid}>
            <StatItem 
              label="Total Battles" 
              value={formatNumber(playerData.statistics?.all?.battles)} 
            />
            <StatItem 
              label="Victories" 
              value={formatNumber(playerData.statistics?.all?.wins)} 
            />
            <StatItem 
              label="Defeats" 
              value={formatNumber(playerData.statistics?.all?.losses)} 
            />
            <StatItem 
              label="Draws" 
              value={formatNumber(playerData.statistics?.all?.draws)} 
            />
            <StatItem 
              label="Survival Rate" 
              value={`${formatNumber((1 - (playerData.statistics?.all?.deaths || 0) / (playerData.statistics?.all?.battles || 1)) * 100, 1)}%`} 
            />
            <StatItem 
              label="Total Deaths" 
              value={formatNumber(playerData.statistics?.all?.deaths)} 
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="airplane" size={24} color="#002b80" />
          <Text style={styles.cardTitle}>Combat Efficiency</Text>
        </View>
        <View style={styles.cardContent}>
          <InfoRow 
            label="Best Battle Score" 
            value={formatNumber(playerData.statistics?.all?.max_battles_score)} 
          />
          <InfoRow 
            label="Average Score" 
            value={formatNumber(playerData.statistics?.all?.avg_battle_score)} 
          />
          <InfoRow 
            label="Zone Captures" 
            value={formatNumber(playerData.statistics?.all?.zone_captures)} 
          />
          <InfoRow 
            label="Flight Hours" 
            value={`${formatNumber(playerData.statistics?.all?.flight_time / 3600, 1)}h`} 
          />
          <InfoRow 
            label="Total Flights" 
            value={formatNumber(playerData.statistics?.all?.flights)} 
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flame" size={24} color="#002b80" />
          <Text style={styles.cardTitle}>Detailed Combat Statistics</Text>
        </View>
        <View style={styles.cardContent}>
          {/* Air Targets Section */}
          <View style={styles.combatSection}>
            <Text style={styles.combatTitle}>Air Combat</Text>
            <View style={styles.detailsGrid}>
              <StatItem 
                label="Air Targets Killed" 
                value={formatNumber(playerData.statistics?.all?.air_targets?.killed)} 
              />
              <StatItem 
                label="Max Damage (Air)" 
                value={formatNumber(playerData.statistics?.all?.air_targets?.max_damage_dealt)} 
              />
              <StatItem 
                label="Kills per Flight" 
                value={formatNumber(playerData.statistics?.all?.air_targets?.avg_killed_per_flight, 2)} 
              />
            </View>
          </View>

          {/* Ground Combat Section */}
          <View style={styles.combatSection}>
            <Text style={styles.combatTitle}>Ground Combat</Text>
            <View style={styles.detailsGrid}>
              <StatItem 
                label="Ground Kills" 
                value={formatNumber(playerData.statistics?.all?.ground_objects?.killed)} 
              />
              <StatItem 
                label="Ground Damage" 
                value={formatNumber(playerData.statistics?.all?.ground_objects?.damage_dealt)} 
              />
              <StatItem 
                label="Max Ground Kills" 
                value={formatNumber(playerData.statistics?.all?.ground_objects?.max_killed)} 
              />
              <StatItem 
                label="Ground Assists" 
                value={formatNumber(playerData.statistics?.all?.ground_objects?.assisted)} 
              />
            </View>
          </View>

          {/* Player Combat Section */}
          <View style={styles.combatSection}>
            <Text style={styles.combatTitle}>Player Combat</Text>
            <View style={styles.detailsGrid}>
              <StatItem 
                label="Players Killed" 
                value={formatNumber(playerData.statistics?.all?.players?.killed)} 
              />
              <StatItem 
                label="Player Damage" 
                value={formatNumber(playerData.statistics?.all?.players?.damage_dealt)} 
              />
              <StatItem 
                label="Defense Kills" 
                value={formatNumber(playerData.statistics?.all?.players?.killed_in_defence)} 
              />
              <StatItem 
                label="Player Assists" 
                value={formatNumber(playerData.statistics?.all?.players?.assisted)} 
              />
              <StatItem 
                label="Max Player Kills" 
                value={formatNumber(playerData.statistics?.all?.players?.max_killed)} 
              />
              <StatItem 
                label="Max Damage" 
                value={formatNumber(playerData.statistics?.all?.players?.max_damage_dealt)} 
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nickname}>{playerData.nickname}</Text>
        <Text style={styles.accountId}>ID: {playerId}</Text>
      </View>

      {renderTabs()}

      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'combat' && renderCombatTab()}
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const StatBox = ({ label, value, icon }) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={24} color="#002b80" style={styles.statIcon} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statItemLabel}>{label}</Text>
    <Text style={styles.statItemValue}>{value}</Text>
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
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  accountId: {
    color: '#d2af39',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#002b80',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#002b80',
    fontWeight: 'bold',
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
  },
  infoValue: {
    fontSize: 15,
    color: '#002b80',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  statIcon: {
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002b80',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  combatSection: {
    marginBottom: 20,
  },
  combatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002b80',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#002b80',
    paddingLeft: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statItemLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  statItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002b80',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
});