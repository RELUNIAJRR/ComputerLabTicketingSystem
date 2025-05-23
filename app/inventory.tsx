import { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type { Equipment } from '../lib/supabase';
import { supabase } from '../lib/supabase';

export default function InventoryScreen() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Partial<Equipment>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('name');

      if (error) throw error;
      setEquipment(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!currentEquipment.name || !currentEquipment.type || !currentEquipment.serial_number || !currentEquipment.location) {
        throw new Error('Please fill in all required fields');
      }

      if (currentEquipment.id) {
        // Update existing equipment
        const { error } = await supabase
          .from('equipment')
          .update({
            name: currentEquipment.name,
            type: currentEquipment.type,
            status: currentEquipment.status,
            serial_number: currentEquipment.serial_number,
            location: currentEquipment.location,
            notes: currentEquipment.notes,
          })
          .eq('id', currentEquipment.id);

        if (error) throw error;
      } else {
        // Add new equipment
        const { error } = await supabase.from('equipment').insert([
          {
            name: currentEquipment.name,
            type: currentEquipment.type,
            status: currentEquipment.status || 'available',
            serial_number: currentEquipment.serial_number,
            location: currentEquipment.location,
            notes: currentEquipment.notes,
          },
        ]);

        if (error) throw error;
      }

      setModalVisible(false);
      fetchEquipment();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentEquipment({});
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>Add Equipment</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search equipment..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView style={styles.list}>
        {filteredEquipment.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.equipmentCard}
            onPress={() => {
              setCurrentEquipment(item);
              setModalVisible(true);
            }}
          >
            <View style={styles.equipmentHeader}>
              <Text style={styles.equipmentName}>{item.name}</Text>
              <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.equipmentDetail}>Type: {item.type}</Text>
            <Text style={styles.equipmentDetail}>S/N: {item.serial_number}</Text>
            <Text style={styles.equipmentDetail}>Location: {item.location}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentEquipment.id ? 'Edit Equipment' : 'Add Equipment'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Equipment Name"
              value={currentEquipment.name}
              onChangeText={(text) =>
                setCurrentEquipment({ ...currentEquipment, name: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Type"
              value={currentEquipment.type}
              onChangeText={(text) =>
                setCurrentEquipment({ ...currentEquipment, type: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Serial Number"
              value={currentEquipment.serial_number}
              onChangeText={(text) =>
                setCurrentEquipment({ ...currentEquipment, serial_number: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Location"
              value={currentEquipment.location}
              onChangeText={(text) =>
                setCurrentEquipment({ ...currentEquipment, location: text })
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes"
              value={currentEquipment.notes}
              onChangeText={(text) =>
                setCurrentEquipment({ ...currentEquipment, notes: text })
              }
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
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
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  addButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  list: {
    padding: 16,
  },
  equipmentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  equipmentDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status_available: {
    backgroundColor: '#D1FAE5',
  },
  'status_in-use': {
    backgroundColor: '#DBEAFE',
  },
  status_maintenance: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#1e40af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
}); 