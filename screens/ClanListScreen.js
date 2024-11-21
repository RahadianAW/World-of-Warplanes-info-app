// screens/ClanListScreen.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function ClanList({ navigation }) {
  const [clans, setClans] = useState([]);

  useEffect(() => {
    fetchClans();
  }, []);

  const fetchClans = async () => {
    try {
      const response = await axios.get(
        'https://api.worldofwarplanes.eu/wowp/clans/list/?application_id=bd97f45a0776692f36595954cd945a29'
      );
      setClans(response.data.data);
    } catch (error) {
      console.error(error); 
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.clanCard}
      onPress={() => navigation.navigate('ClanDetail', { clanId: item.clan_id })}
    >
      <Text style={styles.clanName}>{item.name}</Text>
      <Text style={styles.memberCount}>Members: {item.members_count}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={clans}
        renderItem={renderItem}
        keyExtractor={(item) => item.clan_id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  clanCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: '#00338f',
    borderWidth: 1
  },
  clanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002b80'
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  }
});