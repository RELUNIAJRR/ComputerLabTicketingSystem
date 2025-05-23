import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../lib/auth';
import type { Equipment, Ticket } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';

export default function TicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Partial<Ticket>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const ticketStatuses = ['open', 'in-progress', 'resolved', 'closed'] as const;
  type TicketStatus = typeof ticketStatuses[number];
  const ticketPriorities = ['low', 'medium', 'high'] as const;
  type TicketPriority = typeof ticketPriorities[number];

  useEffect(() => {
    fetchTickets();
    fetchEquipment();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('name');

      if (error) throw error;
      setEquipment(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch equipment');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!currentTicket.title || !currentTicket.description) {
        throw new Error('Please fill in all required fields');
      }

      if (currentTicket.id) {
        // Update existing ticket
        const { error } = await supabase
          .from('tickets')
          .update({
            title: currentTicket.title,
            description: currentTicket.description,
            status: currentTicket.status,
            priority: currentTicket.priority,
            equipment_id: currentTicket.equipment_id,
          })
          .eq('id', currentTicket.id);

        if (error) throw error;
      } else {
        // Create new ticket
        const { error } = await supabase.from('tickets').insert([
          {
            title: currentTicket.title,
            description: currentTicket.description,
            status: 'open',
            priority: currentTicket.priority || 'medium',
            equipment_id: currentTicket.equipment_id,
            created_by: user?.id,
          },
        ]);

        if (error) throw error;
      }

      setModalVisible(false);
      fetchTickets();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save ticket');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support Tickets</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentTicket({});
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>New Ticket</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search tickets..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading && !modalVisible ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e40af" />
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {filteredTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={styles.ticketCard}
              onPress={() => {
                setCurrentTicket(ticket);
                setModalVisible(true);
              }}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                <View
                  style={[styles.badge, styles[`priority_${ticket.priority}`]]}
                >
                  <Text style={styles.badgeText}>{ticket.priority}</Text>
                </View>
              </View>
              <Text style={styles.ticketDescription} numberOfLines={2}>
                {ticket.description}
              </Text>
              <View style={styles.ticketFooter}>
                <View style={[styles.badge, styles[`status_${ticket.status}`]]}>
                  <Text style={styles.badgeText}>{ticket.status}</Text>
                </View>
                <Text style={styles.ticketDate}>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTicket.id ? 'Edit Ticket' : 'New Ticket'}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={currentTicket.title}
                onChangeText={(text) =>
                  setCurrentTicket({ ...currentTicket, title: text })
                }
                placeholder="Ticket title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentTicket.description}
                onChangeText={(text) =>
                  setCurrentTicket({ ...currentTicket, description: text })
                }
                placeholder="Describe the issue"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Equipment</Text>
              <View style={styles.equipmentSelect}>
                {equipment.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.equipmentOption,
                      currentTicket.equipment_id === item.id &&
                        styles.selectedEquipmentOption,
                    ]}
                    onPress={() =>
                      setCurrentTicket({
                        ...currentTicket,
                        equipment_id: item.id,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.equipmentOptionText,
                        currentTicket.equipment_id === item.id &&
                          styles.selectedEquipmentOptionText,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {currentTicket.id && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusOptions}>
                  {ticketStatuses.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusOption,
                        currentTicket.status === status &&
                          styles.selectedStatusOption,
                      ]}
                      onPress={() =>
                        setCurrentTicket({
                          ...currentTicket,
                          status: status as TicketStatus,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          currentTicket.status === status &&
                            styles.selectedStatusOptionText,
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityOptions}>
                {ticketPriorities.map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      currentTicket.priority === priority &&
                        styles.selectedPriorityOption,
                      styles[`priorityOption_${priority}`],
                    ]}
                    onPress={() =>
                      setCurrentTicket({
                        ...currentTicket,
                        priority: priority as TicketPriority,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        currentTicket.priority === priority &&
                          styles.selectedPriorityOptionText,
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priority_low: {
    backgroundColor: '#d1fae5',
  },
  priority_medium: {
    backgroundColor: '#fef3c7',
  },
  priority_high: {
    backgroundColor: '#fee2e2',
  },
  status_open: {
    backgroundColor: '#dbeafe',
  },
  'status_in-progress': {
    backgroundColor: '#fef3c7',
  },
  status_resolved: {
    backgroundColor: '#d1fae5',
  },
  status_closed: {
    backgroundColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  equipmentSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedEquipmentOption: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  equipmentOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  selectedEquipmentOptionText: {
    color: '#fff',
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  selectedStatusOption: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  statusOptionText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedStatusOptionText: {
    color: '#fff',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  priorityOption_low: {
    backgroundColor: '#d1fae5',
  },
  priorityOption_medium: {
    backgroundColor: '#fef3c7',
  },
  priorityOption_high: {
    backgroundColor: '#fee2e2',
  },
  selectedPriorityOption: {
    borderColor: '#1e40af',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedPriorityOptionText: {
    color: '#1e40af',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#1e40af',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
}); 