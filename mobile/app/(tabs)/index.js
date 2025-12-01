import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, RefreshControl, StatusBar } from 'react-native';
import axios from 'axios';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // ⚠️ REPLACE WITH YOUR IP ADDRESS FOUND IN IPCONFIG
  // Example: "http://192.168.1.5:8000"
  // Do NOT use localhost (Android emulator needs 10.0.2.2, physical phone needs 192.168.x.x)
  const API_URL = "https://production-tracking-two.vercel.app/"; 

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Ensure backend is running with --host 0.0.0.0 and IP is correct.");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status: newStatus });
      fetchOrders(); // Refresh list
    } catch (error) {
      Alert.alert("Error", "Could not update status");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={[styles.statusBadge, styles[`status${item.status}`]]}>
          {item.status}
        </Text>
      </View>
      
      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>

      {/* Action Buttons */}
      {item.status !== 'Completed' && (
        <View style={styles.actionRow}>
          <Text style={styles.actionLabel}>Mark as:</Text>
          
          {item.status === 'Pending' && (
            <TouchableOpacity 
              style={[styles.btn, styles.btnProcessing]} 
              onPress={() => updateStatus(item.id, 'Processing')}
            >
              <Text style={styles.btnText}>Processing</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.btn, styles.btnCompleted]} 
            onPress={() => updateStatus(item.id, 'Completed')}
          >
            <Text style={styles.btnText}>Completed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.header}>Production Mobile</Text>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  quantity: {
    color: '#a0a0a0',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  statusPending: { backgroundColor: 'rgba(244, 162, 97, 0.2)', color: '#f4a261' },
  statusProcessing: { backgroundColor: 'rgba(58, 134, 255, 0.2)', color: '#3a86ff' },
  statusCompleted: { backgroundColor: 'rgba(42, 157, 143, 0.2)', color: '#2a9d8f' },
  
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  actionLabel: {
    color: '#888',
    marginRight: 10,
    fontSize: 12,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  btnProcessing: { backgroundColor: '#3a86ff' },
  btnCompleted: { backgroundColor: '#2a9d8f' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});