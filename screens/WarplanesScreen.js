import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Dimensions } from 'react-native';

const NATIONS = ['All', 'USA', 'UK', 'USSR', 'Germany', 'Japan', 'Other'];
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 30) / 2;

export default function WarplanesScreen({ navigation }) {
  const [warplanes, setWarplanes] = useState([]);
  const [filteredWarplanes, setFilteredWarplanes] = useState([]);
  const [selectedNation, setSelectedNation] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWarplanes();
  }, []);

  const fetchWarplanes = async () => {
    try {
      const response = await fetch(
        'https://api.worldofwarplanes.eu/wowp/encyclopedia/planes/?application_id=bd97f45a0776692f36595954cd945a29'
      );
      const data = await response.json();
      const planes = Object.values(data.data);
      setWarplanes(planes);
      setFilteredWarplanes(planes);
    } catch (error) {
      console.error('Error fetching warplanes:', error);
    }
  };

  const filterWarplanes = (nation, query = searchQuery) => {
    let filtered = [...warplanes];
    
    if (nation && nation !== 'All') {
      filtered = filtered.filter(plane => 
        plane.nation && plane.nation.toUpperCase() === nation.toUpperCase()
      );
    }
    
    if (query) {
      filtered = filtered.filter(plane => 
        plane.name && plane.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredWarplanes(filtered);
  };

  useEffect(() => {
    filterWarplanes(selectedNation);
  }, [warplanes, selectedNation]);

  const renderWarplaneCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('WarplaneDetail', { planeId: item.plane_id })}
    >
      <Image
        source={{ uri: item.images?.large }}
        style={styles.planeImage}
      />
      <View style={styles.cardContent}>
        <Text 
          numberOfLines={1} 
          style={[styles.planeName, item.is_premium && styles.premiumText]}
        >
          {item.name.toUpperCase()}
        </Text>
        <Text style={styles.nationText}>{item.nation}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search warplanes..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            filterWarplanes(selectedNation, text);
          }}
        />
      </View>
      
      <FlatList
        horizontal
        data={NATIONS}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.nationButton,
              selectedNation === item && styles.selectedNation
            ]}
            onPress={() => {
              setSelectedNation(item);
            }}
          >
            <Text style={styles.nationButtonText}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.nationsList}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={filteredWarplanes}
        renderItem={renderWarplaneCard}
        keyExtractor={item => item.plane_id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.warplanesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#00338f',
  },
  nationsList: {
    maxHeight: 50,
    backgroundColor: '#fff',
    paddingVertical: 11,
    elevation: 2,
  },
  nationButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#00338f',
  },
  selectedNation: {
    backgroundColor: '#002b80',
  },
  nationButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
  },
  planeImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 8,
  },
  planeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002b80',
  },
  premiumText: {
    color: '#d2af39',
  },
  nationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  warplanesList: {
    paddingVertical: 8,
  },
});