import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

interface Stats {
  totalEquipment: number;
  activeTickets: number;
  criticalIssues: number;
  resolvedToday: number;
}

interface Activity {
  id: number;
  type: 'ticket_created' | 'equipment_added' | 'ticket_resolved' | 'maintenance_scheduled';
  item: string;
  time: string;
}

export default function HomeScreen() {
  const [stats, setStats] = useState<Stats>({
    totalEquipment: 45,
    activeTickets: 8,
    criticalIssues: 2,
    resolvedToday: 12
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    {
      id: 1,
      type: 'ticket_created',
      item: 'Workstation-001',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'equipment_added',
      item: 'Laptop-045',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'ticket_resolved',
      item: 'Server-003',
      time: '6 hours ago'
    },
    {
      id: 4,
      type: 'maintenance_scheduled',
      item: 'Printer-012',
      time: '8 hours ago'
    }
  ]);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard data from Supabase
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Update stats based on actual data
      setStats({
        totalEquipment: 45, // Replace with actual count
        activeTickets: tickets.filter(t => t.status === 'open').length,
        criticalIssues: tickets.filter(t => t.priority === 'high').length,
        resolvedToday: tickets.filter(t => {
          const today = new Date();
          const ticketDate = new Date(t.resolved_at);
          return ticketDate.toDateString() === today.toDateString();
        }).length
      });

      // Update recent activity
      const recentActivities = tickets
        .slice(0, 4)
        .map(ticket => ({
          id: ticket.id,
          type: 'ticket_created' as Activity['type'],
          item: ticket.equipment_id,
          time: getTimeAgo(new Date(ticket.created_at))
        }));

      setRecentActivity(recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return `${diffInHours} hours ago`;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'ticket_created':
        return 'ticket';
      case 'equipment_added':
        return 'desktop';
      case 'ticket_resolved':
        return 'check-circle';
      case 'maintenance_scheduled':
        return 'wrench';
      default:
        return 'info-circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Overview of your equipment and support tickets</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <View style={styles.statsIconContainer}>
            <FontAwesome name="desktop" size={24} color="#4B5563" />
          </View>
          <Text style={styles.statsNumber}>{stats.totalEquipment}</Text>
          <Text style={styles.statsLabel}>Total Equipment</Text>
          <Text style={styles.statsSubtext}>Computer devices</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={[styles.statsIconContainer, { backgroundColor: '#FEF3C7' }]}>
            <FontAwesome name="ticket" size={24} color="#D97706" />
          </View>
          <Text style={styles.statsNumber}>{stats.activeTickets}</Text>
          <Text style={styles.statsLabel}>Active Tickets</Text>
          <Text style={styles.statsSubtext}>Open issues</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={[styles.statsIconContainer, { backgroundColor: '#FEE2E2' }]}>
            <FontAwesome name="exclamation-triangle" size={24} color="#DC2626" />
          </View>
          <Text style={styles.statsNumber}>{stats.criticalIssues}</Text>
          <Text style={styles.statsLabel}>Critical Issues</Text>
          <Text style={styles.statsSubtext}>Urgent problems</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={[styles.statsIconContainer, { backgroundColor: '#D1FAE5' }]}>
            <FontAwesome name="check-circle" size={24} color="#059669" />
          </View>
          <Text style={styles.statsNumber}>{stats.resolvedToday}</Text>
          <Text style={styles.statsLabel}>Resolved Today</Text>
          <Text style={styles.statsSubtext}>Tickets closed</Text>
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.sectionSubtitle}>Latest updates on equipment and tickets</Text>
        
        <View style={styles.activityList}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <FontAwesome name={getActivityIcon(activity.type)} size={20} color="#4B5563" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {activity.type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
                <Text style={styles.activitySubtext}>{activity.item}</Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  activitySection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activitySubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
});
