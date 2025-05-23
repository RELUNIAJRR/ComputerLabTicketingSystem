import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../lib/auth';
import type { Ticket } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';

export default function DashboardScreen() {
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [equipmentStats, setEquipmentStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch equipment statistics
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('status');

      if (equipmentError) throw equipmentError;

      const stats = {
        total: equipment.length,
        available: equipment.filter(e => e.status === 'available').length,
        inUse: equipment.filter(e => e.status === 'in-use').length,
        maintenance: equipment.filter(e => e.status === 'maintenance').length,
      };

      // Fetch recent tickets
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (ticketsError) throw ticketsError;

      setRecentTickets(tickets);
      setEquipmentStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Equipment Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{equipmentStats.total}</Text>
            <Text style={styles.statLabel}>Total Equipment</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#DEF7EC' }]}>
            <Text style={styles.statNumber}>{equipmentStats.available}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.statNumber}>{equipmentStats.inUse}</Text>
            <Text style={styles.statLabel}>In Use</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FDE2E1' }]}>
            <Text style={styles.statNumber}>{equipmentStats.maintenance}</Text>
            <Text style={styles.statLabel}>Maintenance</Text>
          </View>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Tickets</Text>
        {recentTickets.map((ticket) => (
          <View key={ticket.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <FontAwesome name="ticket" size={20} color="#1e40af" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{ticket.title}</Text>
              <Text style={styles.activityTime}>
                {new Date(ticket.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
    backgroundColor: '#1e40af',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  recentActivity: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ebf5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
  },
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return '#FEF3C7';
    case 'in-progress':
      return '#DBEAFE';
    case 'resolved':
      return '#D1FAE5';
    case 'closed':
      return '#E5E7EB';
    default:
      return '#E5E7EB';
  }
}; 