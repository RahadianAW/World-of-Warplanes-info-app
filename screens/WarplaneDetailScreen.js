// screens/WarplaneDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

export default function WarplaneDetailScreen({ route, navigation }) {
  const { planeId } = route.params;
  const [planeDetails, setPlaneDetails] = useState(null);
  const [prevPlanes, setPrevPlanes] = useState([]);
  const [nextPlanes, setNextPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaneDetails();
  }, []);

  const fetchPlaneDetails = async () => {
    try {
      const response = await fetch(
        `https://api.worldofwarplanes.eu/wowp/encyclopedia/planeinfo/?application_id=bd97f45a0776692f36595954cd945a29&plane_id=${planeId}`
      );
      const data = await response.json();
      const currentPlane = data.data[planeId];
      setPlaneDetails(currentPlane);

      // Fetch previous planes details
      if (currentPlane.prev_planes?.length > 0) {
        const prevResponse = await fetch(
          `https://api.worldofwarplanes.eu/wowp/encyclopedia/planes/?application_id=bd97f45a0776692f36595954cd945a29`
        );
        const prevData = await prevResponse.json();
        const prevPlanesDetails = currentPlane.prev_planes.map(id => ({
          id,
          name: prevData.data[id]?.name || `Aircraft ${id}`,
          nation: prevData.data[id]?.nation,
          type: prevData.data[id]?.type,
          level: prevData.data[id]?.level,
          is_premium: prevData.data[id]?.is_premium
        }));
        setPrevPlanes(prevPlanesDetails);
      }

      // Fetch next planes details
      if (currentPlane.next_planes?.length > 0) {
        const nextResponse = await fetch(
          `https://api.worldofwarplanes.eu/wowp/encyclopedia/planes/?application_id=bd97f45a0776692f36595954cd945a29`
        );
        const nextData = await nextResponse.json();
        const nextPlanesDetails = currentPlane.next_planes.map(id => ({
          id,
          name: nextData.data[id]?.name || `Aircraft ${id}`,
          nation: nextData.data[id]?.nation,
          type: nextData.data[id]?.type,
          level: nextData.data[id]?.level,
          is_premium: nextData.data[id]?.is_premium
        }));
        setNextPlanes(nextPlanesDetails);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00338f" />
      </View>
    );
  }

  if (!planeDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };

  const renderPlaneBox = (plane, index) => (
    <TouchableOpacity 
      key={plane.id}
      style={styles.planeBox}
      onPress={() => navigation.push('WarplaneDetail', { planeId: plane.id })}
    >
      <Text style={[styles.planeName, plane.is_premium && styles.premiumText]}>
        {plane.name}
      </Text>
      <Text style={styles.planeInfo}>Tier {plane.level} • {plane.nation}</Text>
      <Text style={styles.planeType}>{plane.type}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: planeDetails.images?.large }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={[styles.name, planeDetails.is_premium && styles.premiumText]}>
          {planeDetails.name || 'Unknown Name'}
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.detailsGrid}>
            <DetailItem label="Nation" value={planeDetails.nation || 'N/A'} />
            <DetailItem label="Tier" value={planeDetails.level?.toString() || 'N/A'} />
            <DetailItem label="Type" value={planeDetails.type || 'N/A'} />
            <DetailItem 
              label="Price (Credits)" 
              value={planeDetails.price_credit ? formatNumber(planeDetails.price_credit) : 'N/A'} 
            />
            <DetailItem 
              label="Price (Gold)" 
              value={planeDetails.price_gold ? formatNumber(planeDetails.price_gold) : 'N/A'} 
            />
            <DetailItem 
              label="Status" 
              value={planeDetails.is_premium ? 'Premium' : planeDetails.is_gift ? 'Gift' : 'Regular'} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Specifications</Text>
          <View style={styles.detailsGrid}>
            <DetailItem 
              label="Max Speed" 
              value={planeDetails.features?.max_speed ? `${planeDetails.features.max_speed} km/h` : 'N/A'} 
            />
            <DetailItem 
              label="Ground Speed" 
              value={planeDetails.features?.speed_at_the_ground ? `${planeDetails.features.speed_at_the_ground} km/h` : 'N/A'} 
            />
            <DetailItem 
              label="Optimal Height" 
              value={planeDetails.features?.optimal_height ? `${planeDetails.features.optimal_height} m` : 'N/A'} 
            />
            <DetailItem 
              label="Rate of Climb" 
              value={planeDetails.features?.rate_of_climbing ? `${planeDetails.features.rate_of_climbing} m/s` : 'N/A'} 
            />
            <DetailItem 
              label="Turn Time" 
              value={planeDetails.features?.average_turn_time ? `${planeDetails.features.average_turn_time} s` : 'N/A'} 
            />
            <DetailItem 
              label="Mass" 
              value={planeDetails.features?.mass ? `${planeDetails.features.mass} kg` : 'N/A'} 
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Combat Characteristics</Text>
          <View style={styles.detailsGrid}>
            <DetailItem 
              label="Hit Points" 
              value={planeDetails.features?.hp?.toString() || 'N/A'} 
            />
            <DetailItem 
              label="Firepower" 
              value={planeDetails.features?.dps?.toString() || 'N/A'} 
            />
            <DetailItem 
              label="Maneuverability" 
              value={planeDetails.features?.maneuverability?.toString() || 'N/A'} 
            />
            <DetailItem 
              label="Controllability" 
              value={planeDetails.features?.controllability?.toString() || 'N/A'} 
            />
            <DetailItem 
              label="Roll Rate" 
              value={planeDetails.features?.roll_maneuverability?.toString() || 'N/A'} 
            />
            <DetailItem 
              label="Speed Factor" 
              value={planeDetails.features?.speed_factor?.toString() || 'N/A'} 
            />
          </View>
        </View>

        {(prevPlanes.length > 0 || nextPlanes.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aircraft Development Tree</Text>
            
            {prevPlanes.length > 0 && (
              <View style={styles.treeSection}>
                <Text style={styles.treeLabel}>Previous Aircraft:</Text>
                <View style={styles.planeList}>
                  {prevPlanes.map(renderPlaneBox)}
                </View>
              </View>
            )}

            <View style={styles.currentPlaneBox}>
              <Text style={styles.currentPlaneLabel}>Current Aircraft:</Text>
              <Text style={styles.currentPlaneName}>{planeDetails.name}</Text>
            </View>

            {nextPlanes.length > 0 && (
              <View style={styles.treeSection}>
                <Text style={styles.treeLabel}>Next Aircraft:</Text>
                <View style={styles.planeList}>
                  {nextPlanes.map(renderPlaneBox)}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{planeDetails.description || 'No description available'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002b80',
    marginBottom: 15,
  },
  premiumText: {
    color: '#d2af39',
  },
  section: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00338f',
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002b80',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00338f',
    paddingBottom: 5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002b80',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  treeSection: {
    marginVertical: 10,
  },
  treeLabel: {
    fontSize: 16,
    color: '#002b80',
    fontWeight: '600',
    marginBottom: 8,
  },
  planeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planeBox: {
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#00338f',
    width: '48%',
    marginBottom: 10,
  },
  planeName: {
    color: '#002b80',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  planeInfo: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  planeType: {
    color: '#002b80',
    fontSize: 12,
  },
  currentPlaneBox: {
    backgroundColor: '#002b80',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  currentPlaneLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  currentPlaneName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});