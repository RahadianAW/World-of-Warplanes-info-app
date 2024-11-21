// PlayerScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function PlayerScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPlayers = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://api.worldofwarplanes.eu/wowp/account/list/?application_id=bd97f45a0776692f36595954cd945a29&search=${searchQuery}`
      );
      const data = await response.json();
      setPlayers(data.data);
      setError('');
    } catch (error) {
      setError('Error searching players');
    } finally {
      setLoading(false);
    }
  };

  const renderPlayerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.playerCard}
      onPress={() => navigation.navigate('PlayerDetail', { playerId: item.account_id })}
    >
      <Text style={styles.playerName}>{item.nickname}</Text>
      <Text style={styles.playerId}>ID: {item.account_id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchPlayers}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchPlayers}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={players}
        renderItem={renderPlayerItem}
        keyExtractor={item => item.account_id.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 15,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00338f',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#002b80',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  playerCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00338f',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002b80',
  },
  playerId: {
    color: '#666',
    marginTop: 4,
  },
});