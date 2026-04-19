import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Alert, StyleSheet } from 'react-native';
import { Company, getAllCompanies, addCompany, updateCompanyStatus, deleteCompany, checkCompanyExists } from '../service/database';

export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newMetro, setNewMetro] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCompanies = async () => {
    const data = await getAllCompanies();
    setCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleAddCompany = async () => {
    if (!newCompany.trim() || !newMetro.trim()) {
      Alert.alert('Error', 'Please enter both company name and metro station');
      return;
    }

    const existing = await checkCompanyExists(newCompany.trim());
    if (existing) {
      Alert.alert('Duplicate', `"${newCompany}" already exists in your list!`);
      return;
    }

    const success = await addCompany(newCompany.trim(), newMetro.trim());
    if (success) {
      setNewCompany('');
      setNewMetro('');
      setModalVisible(false);
      loadCompanies();
    } else {
      Alert.alert('Error', 'Failed to add company');
    }
  };

  const handleToggleComplete = async (company: Company) => {
    await updateCompanyStatus(company.id, !company.completed);
    loadCompanies();
  };

  const handleDelete = (company: Company) => {
    Alert.alert(
      'Delete',
      `Remove "${company.name}" from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteCompany(company.id);
          loadCompanies();
        }}
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.checkCell]}></Text>
      <Text style={[styles.headerCell, styles.nameCell]}>Company</Text>
      <Text style={[styles.headerCell, styles.metroCell]}>Metro Station</Text>
      <Text style={[styles.headerCell, styles.actionCell]}></Text>
    </View>
  );

  const renderItem = ({ item }: { item: Company }) => (
    <View style={[styles.row, item.completed && styles.completedRow]}>
      <TouchableOpacity
        style={[styles.checkCell, styles.checkBox, item.completed && styles.checkBoxChecked]}
        onPress={() => handleToggleComplete(item)}
      >
        {item.completed ? <Text style={styles.checkMark}>✓</Text> : null}
      </TouchableOpacity>
      <Text style={[styles.cell, styles.nameCell, item.completed && styles.completedText]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.cell, styles.metroCell, item.completed && styles.completedText]} numberOfLines={1}>
        {item.metroStation}
      </Text>
      <TouchableOpacity style={[styles.actionCell, styles.deleteBtn]} onPress={() => handleDelete(item)}>
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Interview Tracker</Text>
        <Text style={styles.subtitle}>{companies.filter(c => !c.completed).length} companies left to visit</Text>
      </View>

      {renderHeader()}
      
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No companies yet. Tap + to add one!</Text> : null}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Company</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              placeholderTextColor="#999"
              value={newCompany}
              onChangeText={setNewCompany}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Metro Station"
              placeholderTextColor="#999"
              value={newMetro}
              onChangeText={setNewMetro}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                setNewCompany('');
                setNewMetro('');
                setModalVisible(false);
              }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddCompany}>
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#374151',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  completedRow: {
    backgroundColor: '#f0fdf4',
  },
  cell: {
    fontSize: 14,
    color: '#1f2937',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  checkCell: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameCell: {
    flex: 2,
    paddingHorizontal: 8,
  },
  metroCell: {
    flex: 1.5,
    paddingHorizontal: 8,
  },
  actionCell: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  checkBoxChecked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 24,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  cancelBtnText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  addBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    marginLeft: 8,
  },
  addBtnText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});