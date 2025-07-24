import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUser } from '@contexts/UserContext';
import EventList from '@components/features/pages/event/EventList';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS_ORG = [
  { key: 'my-pending', label: 'Pendientes' },
  { key: 'my-assigned', label: 'Asignados' },
  { key: 'my-events', label: 'Todos' },
];
const TABS_MUSIC = [
  { key: 'my-scheduled', label: 'Agendados' },
  { key: 'my-events', label: 'Todos' },
];

const MyEventsList = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const isOrg = user?.roll === 'eventCreator';
  const tabs = isOrg ? TABS_ORG : TABS_MUSIC;
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary, paddingTop: insets.top + 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, backgroundColor: theme.colors.background.card, zIndex: 10 }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 8,
              marginHorizontal: 6,
              borderRadius: 20,
              backgroundColor: activeTab === tab.key ? theme.colors.primary[500] : theme.colors.background.primary,
            }}
          >
            <Text style={{ color: activeTab === tab.key ? '#fff' : theme.colors.text.primary, fontWeight: 'bold' }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <EventList mode={activeTab as any} />
    </View>
  );
};

export default MyEventsList; 